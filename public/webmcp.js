(() => {
  const getContext = () => document.modelContext || window.navigator?.modelContext;

  const toolError = (message) => ({
    content: [{ type: 'text', text: message }],
    isError: true,
  });

  const requestJson = async (url, options) => {
    const response = await fetch(url, options);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || data.message || `Request failed with ${response.status}`);
    }
    return data;
  };

  const registerTools = () => {
    const context = getContext();
    if (!context || window.__sitmWebMcpRegistered) return;
    window.__sitmWebMcpRegistered = true;

    context.registerTool({
      name: 'search_movies',
      description: 'List available movies, showtimes, venues, genres, and prices.',
      inputSchema: {
        type: 'object',
        properties: {
          search: { type: 'string' },
          genre: { type: 'string' },
          format: { type: 'string' },
        },
      },
      execute: async (input = {}) => {
        try {
          const params = new URLSearchParams();
          ['search', 'genre', 'format'].forEach((key) => {
            if (input[key]) params.set(key, input[key]);
          });
          const data = await requestJson(`/api/movies?${params}`);
          return { content: [{ type: 'text', text: JSON.stringify(data.data.movies) }] };
        } catch (error) {
          return toolError(error.message);
        }
      },
    });

    context.registerTool({
      name: 'get_available_seats',
      description: 'Show available one-based seat numbers for a movie.',
      inputSchema: {
        type: 'object',
        properties: { movieId: { type: 'string' } },
        required: ['movieId'],
      },
      execute: async ({ movieId }) => {
        try {
          const data = await requestJson(`/api/movies/${encodeURIComponent(movieId)}/seats`);
          const seats = data.data.seats
            .map((isAvailable, index) => (isAvailable ? index + 1 : null))
            .filter((seat) => seat !== null);
          return { content: [{ type: 'text', text: `Available seats for ${data.data.movieTitle}: ${seats.join(', ')}` }] };
        } catch (error) {
          return toolError(error.message);
        }
      },
    });

    context.registerTool({
      name: 'stranger_vote',
      description: 'Create a group session and calculate the best contiguous seat blocks.',
      inputSchema: {
        type: 'object',
        properties: {
          movieId: { type: 'string' },
          groupSize: { type: 'integer', minimum: 1, maximum: 8 },
        },
        required: ['movieId'],
      },
      execute: async ({ movieId, groupSize = 4 }) => {
        try {
          const data = await requestJson('/api/sessions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ movieId, groupSize }),
          });
          const session = data.data.session;
          return {
            content: [{
              type: 'text',
              text: JSON.stringify({ sessionId: session.id, movie: session.movie.title, suggestions: session.suggestions }),
            }],
          };
        } catch (error) {
          return toolError(error.message);
        }
      },
    });

    context.registerTool({
      name: 'book_tickets',
      description: 'Book one-based seat numbers for an existing group session.',
      inputSchema: {
        type: 'object',
        properties: {
          sessionId: { type: 'string' },
          seats: { type: 'array', items: { type: 'integer', minimum: 1, maximum: 48 } },
        },
        required: ['sessionId', 'seats'],
      },
      execute: async ({ sessionId, seats }) => {
        try {
          const data = await requestJson(`/api/sessions/${encodeURIComponent(sessionId)}/book`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ seatIndices: seats.map((seat) => seat - 1), bookedBy: 'Stranger In The Middle AI' }),
          });
          return { content: [{ type: 'text', text: JSON.stringify(data.data) }] };
        } catch (error) {
          return toolError(error.message);
        }
      },
    });

    context.registerTool({
      name: 'cancel_booking',
      description: 'Cancel an existing booking and release its seats.',
      inputSchema: {
        type: 'object',
        properties: { bookingId: { type: 'string' } },
        required: ['bookingId'],
      },
      execute: async ({ bookingId }) => {
        try {
          const data = await requestJson(`/api/bookings/${encodeURIComponent(bookingId)}`, { method: 'DELETE' });
          return { content: [{ type: 'text', text: data.message }] };
        } catch (error) {
          return toolError(error.message);
        }
      },
    });
  };

  if (getContext()) {
    registerTools();
  } else {
    window.addEventListener('load', registerTools, { once: true });
  }
})();
