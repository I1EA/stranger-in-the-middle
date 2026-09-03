(() => {
  const getContext = () => document.modelContext || window.navigator?.modelContext;

  const toolError = (message) => ({
    content: [{ type: 'text', text: message }],
    isError: true,
  });

  const seatLabel = (seatIndex) => {
    const row = Math.floor(seatIndex / 8);
    const col = seatIndex % 8;
    const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
    return `${letters[row] || '?'}${col + 1}`;
  };

  const getActiveSessionId = () => {
    if (typeof window !== 'undefined') {
      if (window.__ACTIVE_SESSION_ID__) return window.__ACTIVE_SESSION_ID__;
      const match = window.location.pathname.match(/\/session\/([^\/]+)/);
      if (match && match[1]) return decodeURIComponent(match[1]);
    }
    return null;
  };

  const setActiveSessionId = (id) => {
    if (typeof window !== 'undefined' && id) {
      window.__ACTIVE_SESSION_ID__ = id;
    }
  };

  const requestJson = async (url, options) => {
    const response = await fetch(url, options);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || data.message || `Request failed with status ${response.status}`);
    }
    return data;
  };

  const handleCreateGroupSession = async ({ movieId, groupSize = 4, organizerName = 'Stranger In The Middle AI' }) => {
    try {
      if (!movieId) {
        return toolError('movieId is required. Use search_movies to find available movie IDs.');
      }
      const data = await requestJson('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ movieId, groupSize, organizerName }),
      });
      const session = data.data.session;
      setActiveSessionId(session.id);

      // Navigate if user is currently on the landing page
      if (typeof window !== 'undefined' && window.location.pathname === '/' && session.id) {
        window.location.href = '/session/' + encodeURIComponent(session.id);
      }

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            sessionId: session.id,
            movie: {
              id: session.movieId,
              title: session.movie?.title,
              venue: session.movie?.venue,
              showtime: session.movie?.time,
              ticketPrice: session.movie?.ticketPrice,
            },
            groupSize: session.groupSize,
            status: session.status,
            suggestionsCount: session.suggestions?.length || 0,
            suggestions: (session.suggestions || []).map((s, idx) => ({
              optionIndex: idx,
              seats: (s.seats || []).map(seatLabel),
              oneBasedSeats: (s.seats || []).map((i) => i + 1),
              view: s.view,
              legroom: s.leg,
              tag: s.tag,
              score: s.score,
              votes: s.votes || 0,
            })),
            sessionUrl: `/session/${session.id}`,
            nextRecommendedAction: `Session created. Call start_group_voting(sessionId="${session.id}") to start the countdown, or cast_vote(sessionId="${session.id}", optionIndex=0) to record a vote.`,
          }, null, 2),
        }],
      };
    } catch (error) {
      return toolError(error.message);
    }
  };

  const registerTools = () => {
    const context = getContext();
    if (!context || window.__sitmWebMcpRegistered) return;
    window.__sitmWebMcpRegistered = true;

    // Tool 1: search_movies
    context.registerTool({
      name: 'search_movies',
      description:
        'Browse the cinema catalogue for available movies, showtimes, venues, genres, formats, and ticket prices. Call this first to discover movies and retrieve a valid movieId.',
      inputSchema: {
        type: 'object',
        properties: {
          search: { type: 'string', description: 'Filter movies by title, actor, or venue keywords.' },
          genre: { type: 'string', description: 'Filter by genre (e.g. "Action", "Sci-Fi", "Drama").' },
          format: { type: 'string', description: 'Filter by projection format (e.g. "IMAX", "Dolby Cinema").' },
        },
      },
      execute: async (input = {}) => {
        try {
          const params = new URLSearchParams();
          ['search', 'genre', 'format'].forEach((key) => {
            if (input[key]) params.set(key, input[key]);
          });
          const data = await requestJson(`/api/movies?${params}`);
          return { content: [{ type: 'text', text: JSON.stringify(data.data.movies, null, 2) }] };
        } catch (error) {
          return toolError(error.message);
        }
      },
    });

    // Tool 2: get_available_seats
    context.registerTool({
      name: 'get_available_seats',
      description:
        'Query the seat availability map for a specific movie before booking. Returns 1-based seat numbers and overall occupancy.',
      inputSchema: {
        type: 'object',
        properties: {
          movieId: { type: 'string', description: 'The unique movie identifier (e.g. "spiderman", "dune2").' },
        },
        required: ['movieId'],
      },
      execute: async ({ movieId }) => {
        try {
          if (!movieId) return toolError('movieId is required.');
          const data = await requestJson(`/api/movies/${encodeURIComponent(movieId)}/seats`);
          const availableSeats = data.data.seats
            .map((isAvailable, index) => (isAvailable ? { seatNumber: index + 1, label: seatLabel(index) } : null))
            .filter(Boolean);

          return {
            content: [{
              type: 'text',
              text: JSON.stringify({
                movieId: data.data.movieId,
                movieTitle: data.data.movieTitle,
                availableSeatsCount: availableSeats.length,
                totalSeats: data.data.seats.length,
                availableSeats: availableSeats.map((s) => s.label),
                nextRecommendedAction: `Call create_group_session(movieId="${data.data.movieId}", groupSize=4) to coordinate contiguous group seating.`,
              }, null, 2),
            }],
          };
        } catch (error) {
          return toolError(error.message);
        }
      },
    });

    // Tool 3: create_group_session
    context.registerTool({
      name: 'create_group_session',
      description:
        'Create a new cinema group voting session for a chosen movie. Calculates optimal contiguous seat blocks for the group so no strangers sit between them. Returns sessionId and seat options. Call start_group_voting or cast_vote next.',
      inputSchema: {
        type: 'object',
        properties: {
          movieId: {
            type: 'string',
            description: 'The ID of the movie to book (e.g., "spiderman", "dune2", "oppenheimer", "deadpool", "interstellar").',
          },
          groupSize: {
            type: 'integer',
            minimum: 1,
            maximum: 8,
            description: 'Number of people attending in the group (1-8, default is 4).',
          },
          organizerName: {
            type: 'string',
            description: 'Optional name of the person or AI organizing the group booking.',
          },
        },
        required: ['movieId'],
      },
      execute: handleCreateGroupSession,
    });

    // Tool 4: stranger_vote (backwards-compatibility alias for create_group_session)
    context.registerTool({
      name: 'stranger_vote',
      description:
        '(Backwards-compatibility alias for create_group_session) Create a group session and calculate optimal contiguous seat blocks for group voting.',
      inputSchema: {
        type: 'object',
        properties: {
          movieId: {
            type: 'string',
            description: 'The ID of the movie to book (e.g., "spiderman", "dune2").',
          },
          groupSize: {
            type: 'integer',
            minimum: 1,
            maximum: 8,
            description: 'Number of seats required for the group (1-8).',
          },
        },
        required: ['movieId'],
      },
      execute: handleCreateGroupSession,
    });

    // Tool 5: get_session_state
    context.registerTool({
      name: 'get_session_state',
      description:
        'Inspect the real-time state of an active group session, including movie details, group size, seat block options with current vote tallies, voting status (ready, voting, ended, booked), and any winning seat block. Call start_group_voting or cast_vote next if voting, or book_tickets if consensus is reached.',
      inputSchema: {
        type: 'object',
        properties: {
          sessionId: {
            type: 'string',
            description: 'The unique 8-character group session ID. If omitted in browser, uses the currently active room.',
          },
        },
        required: ['sessionId'],
      },
      execute: async ({ sessionId }) => {
        try {
          const sid = sessionId || getActiveSessionId();
          if (!sid) {
            return toolError('sessionId is required. Call create_group_session first or provide an active sessionId.');
          }
          const data = await requestJson(`/api/sessions/${encodeURIComponent(sid)}`);
          const session = data.data.session;
          setActiveSessionId(session.id);

          const agentView = {
            sessionId: session.id,
            movie: {
              id: session.movieId,
              title: session.movie?.title,
              venue: session.movie?.venue,
              showtime: session.movie?.time,
              screen: session.movie?.screen,
              ticketPrice: session.movie?.ticketPrice,
            },
            groupSize: session.groupSize,
            status: session.status,
            suggestions: (session.suggestions || []).map((s, idx) => ({
              optionIndex: idx,
              seats: (s.seats || []).map(seatLabel),
              oneBasedSeats: (s.seats || []).map((i) => i + 1),
              view: s.view,
              legroom: s.leg,
              tag: s.tag,
              score: s.score,
              votes: s.votes || 0,
            })),
            selectedSeats: (session.selectedSeats || []).map(seatLabel),
            winningSeats: (session.winningSeats || []).map(seatLabel),
            winnerOptionIndex: session.winnerOptionIndex,
            voteCounts: session.voteCounts,
            totalVotesCast: Object.keys(session.votes || {}).length,
            timerSeconds: session.timerSeconds,
            expiresAt: session.expiresAt,
            nextRecommendedAction:
              session.status === 'ready'
                ? `Call start_group_voting(sessionId="${session.id}") to open voting.`
                : session.status === 'voting'
                  ? `Call cast_vote(sessionId="${session.id}", optionIndex=0, voterName="Alice") to record votes.`
                  : session.status === 'ended' || session.status === 'booked'
                    ? `Consensus achieved. Call book_tickets(sessionId="${session.id}") to finalize group booking.`
                    : 'Session active.',
          };

          return { content: [{ type: 'text', text: JSON.stringify(agentView, null, 2) }] };
        } catch (error) {
          return toolError(error.message);
        }
      },
    });

    // Tool 6: start_group_voting
    context.registerTool({
      name: 'start_group_voting',
      description:
        'Start the group voting phase and timer for an active session. Enables group participants to cast their votes on contiguous seat options. Call cast_vote next to submit votes.',
      inputSchema: {
        type: 'object',
        properties: {
          sessionId: {
            type: 'string',
            description: 'The unique session ID to activate voting for.',
          },
          durationSeconds: {
            type: 'integer',
            minimum: 10,
            maximum: 600,
            description: 'Duration of the voting countdown in seconds (default is 120).',
          },
        },
        required: ['sessionId'],
      },
      execute: async ({ sessionId, durationSeconds = 120 }) => {
        try {
          const sid = sessionId || getActiveSessionId();
          if (!sid) {
            return toolError('sessionId is required to start voting.');
          }
          const data = await requestJson(`/api/sessions/${encodeURIComponent(sid)}/start-voting`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ durationSeconds }),
          });
          const session = data.data.session;
          setActiveSessionId(session.id);

          return {
            content: [{
              type: 'text',
              text: JSON.stringify({
                sessionId: session.id,
                status: session.status,
                durationSeconds: session.timerSeconds,
                expiresAt: session.expiresAt,
                availableOptionsCount: session.suggestions?.length || 0,
                message: 'Voting phase activated. Participants can now submit votes using cast_vote.',
                nextRecommendedAction: `Call cast_vote with sessionId="${session.id}" and an optionIndex (0 to ${Math.max(0, (session.suggestions?.length || 1) - 1)}).`,
              }, null, 2),
            }],
          };
        } catch (error) {
          return toolError(error.message);
        }
      },
    });

    // Tool 7: cast_vote
    context.registerTool({
      name: 'cast_vote',
      description:
        'Cast a vote for one of the seat block options in an active session. Automatically recalculates vote counts and establishes a winner when all group members have voted. Call get_session_state next to verify consensus.',
      inputSchema: {
        type: 'object',
        properties: {
          sessionId: {
            type: 'string',
            description: 'The session ID where the vote is being cast.',
          },
          optionIndex: {
            type: 'integer',
            minimum: 0,
            description: 'The 0-based index of the preferred seat block (0 for Option 1, 1 for Option 2, etc.).',
          },
          voterName: {
            type: 'string',
            description: 'Optional display name of the voter or AI assistant.',
          },
          voterId: {
            type: 'string',
            description: 'Optional voter identifier to prevent duplicate votes by the same member.',
          },
        },
        required: ['sessionId', 'optionIndex'],
      },
      execute: async ({ sessionId, optionIndex, voterName = 'SITM AI Agent', voterId }) => {
        try {
          const sid = sessionId || getActiveSessionId();
          if (!sid) {
            return toolError('sessionId is required to cast a vote.');
          }
          const data = await requestJson(`/api/sessions/${encodeURIComponent(sid)}/vote`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              optionIndex,
              voterName,
              voterId,
            }),
          });
          const result = data.data;
          const session = result.session || {};
          setActiveSessionId(session.id || sid);

          return {
            content: [{
              type: 'text',
              text: JSON.stringify({
                success: true,
                sessionId: session.id || sid,
                votedOptionIndex: optionIndex,
                voterName,
                voteCounts: result.voteCounts || session.voteCounts,
                sessionStatus: result.sessionStatus || session.status,
                winnerOptionIndex: result.winnerOptionIndex !== undefined ? result.winnerOptionIndex : session.winnerOptionIndex,
                winningSeats: (result.winningSeats || session.winningSeats || []).map(seatLabel),
                totalVotes: Object.keys(session.votes || {}).length,
                groupSize: session.groupSize,
                nextRecommendedAction:
                  (result.sessionStatus || session.status) === 'ended'
                    ? `Consensus reached! Option ${(result.winnerOptionIndex ?? 0) + 1} won. Call book_tickets(sessionId="${session.id || sid}") to book.`
                    : `Vote recorded. Call get_session_state(sessionId="${session.id || sid}") to inspect the leaderboard or cast votes for remaining members.`,
              }, null, 2),
            }],
          };
        } catch (error) {
          return toolError(error.message);
        }
      },
    });

    // Tool 8: book_tickets
    context.registerTool({
      name: 'book_tickets',
      description:
        'Finalize and atomically book tickets for the group session. Locks the winning seat block (or specifically provided seats) in a single transaction with zero risk of a stranger taking an intermediate seat. Call this after voting concludes or once a block is chosen.',
      inputSchema: {
        type: 'object',
        properties: {
          sessionId: {
            type: 'string',
            description: 'The session ID to book.',
          },
          seats: {
            type: 'array',
            items: { type: 'integer', minimum: 1, maximum: 48 },
            description: 'Optional 1-based seat numbers. Omit to automatically book the winning vote block or selected block.',
          },
          bookedBy: {
            type: 'string',
            description: 'Optional name of the person or agent booking the group tickets.',
          },
          paymentMethod: {
            type: 'string',
            description: 'Payment method ("card", "apple_pay", "google_pay"). Default is "card".',
          },
        },
        required: ['sessionId'],
      },
      execute: async ({ sessionId, seats, bookedBy = 'Stranger In The Middle AI', paymentMethod = 'card' }) => {
        try {
          const sid = sessionId || getActiveSessionId();
          if (!sid) {
            return toolError('sessionId is required to book tickets.');
          }
          const data = await requestJson(`/api/sessions/${encodeURIComponent(sid)}/book`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              seatIndices: seats?.map((seat) => seat - 1),
              bookedBy,
              paymentMethod,
            }),
          });
          const booking = data.data.booking;
          return {
            content: [{
              type: 'text',
              text: JSON.stringify({
                success: true,
                message: 'Seats booked and confirmed successfully! Group sitting together with zero strangers.',
                bookingId: booking.bookingId,
                movie: booking.movieTitle,
                venue: booking.venue,
                showtime: booking.showtime,
                seats: booking.seatLabels,
                ticketCount: booking.ticketCount,
                totalPrice: `£${booking.totalPrice?.toFixed(2)}`,
                confirmationUrl: `/confirmation/${booking.bookingId}`,
              }, null, 2),
            }],
          };
        } catch (error) {
          return toolError(error.message);
        }
      },
    });

    // Tool 9: cancel_booking
    context.registerTool({
      name: 'cancel_booking',
      description:
        'Cancel an existing confirmed booking and release its seats back to the session and cinema inventory.',
      inputSchema: {
        type: 'object',
        properties: {
          bookingId: {
            type: 'string',
            description: 'The booking reference ID (e.g., "SITM-XXXXXXXX").',
          },
        },
        required: ['bookingId'],
      },
      execute: async ({ bookingId }) => {
        try {
          if (!bookingId) {
            return toolError('bookingId is required to cancel a booking.');
          }
          const data = await requestJson(`/api/bookings/${encodeURIComponent(bookingId)}`, { method: 'DELETE' });
          return { content: [{ type: 'text', text: data.message || 'Booking successfully cancelled and seats released.' }] };
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
