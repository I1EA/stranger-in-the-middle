import { v4 as uuidv4 } from 'uuid';

/**
 * Cinema and Seating Configuration Constants
 */
export const ROWS = 6;
export const COLS = 8;
export const TOTAL_SEATS = ROWS * COLS;
export const ROW_LABELS = ['A', 'B', 'C', 'D', 'E', 'F'];

/**
 * Pre-seeded Movies Catalog with Rich Cinema Metadata
 */
export const INITIAL_MOVIES = {
  spiderman: {
    id: 'spiderman',
    title: 'Spider-Man: Beyond the Spider-Verse',
    time: '7:00 PM',
    showtimes: ['5:15 PM', '7:00 PM', '9:45 PM'],
    venue: 'Odeon Luxe Leicester Square',
    screen: 'Screen 1 · Dolby Cinema',
    duration: '2h 20min',
    rating: 'PG-13',
    imdbRating: '8.9',
    ticketPrice: 18.50,
    badge: 'SELLING FAST',
    badgeColor: '#dc2626',
    format: 'Dolby Cinema & Atmos',
    genre: ['Action', 'Animation', 'Sci-Fi'],
    director: 'Joaquim Dos Santos, Kemp Powers',
    cast: ['Shameik Moore', 'Hailee Steinfeld', 'Oscar Isaac', 'Daniel Kaluuya'],
    poster: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=600&q=80',
    backdrop: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80',
    description: 'Miles Morales traverses the multiverse in a heart-pounding race against fate alongside Gwen Stacy and the Spider-Society.',
    highlight: 'Experience unmatched contrast and Dolby Atmos 360° object-based surround sound.',
  },
  dune2: {
    id: 'dune2',
    title: 'Dune: Part Two (IMAX 70mm)',
    time: '8:30 PM',
    showtimes: ['4:30 PM', '8:30 PM', '11:15 PM'],
    venue: 'BFI IMAX Waterloo',
    screen: 'Grand IMAX Screen · 1.43:1',
    duration: '2h 46min',
    rating: 'PG-13',
    imdbRating: '8.6',
    ticketPrice: 24.00,
    badge: 'POPULAR',
    badgeColor: '#d97706',
    format: 'IMAX 70mm Large Format',
    genre: ['Sci-Fi', 'Adventure', 'Action'],
    director: 'Denis Villeneuve',
    cast: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson', 'Austin Butler'],
    poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
    backdrop: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    description: 'Paul Atreides unites with Chani and the Fremen on a warpath of revenge against the conspirators who destroyed his family.',
    highlight: 'Specially shot with IMAX cameras to expand up to 40% more picture.',
  },
  oppenheimer: {
    id: 'oppenheimer',
    title: 'Oppenheimer (70mm Exclusive)',
    time: '6:15 PM',
    showtimes: ['2:45 PM', '6:15 PM', '9:30 PM'],
    venue: 'Science Museum IMAX',
    screen: 'Ronson Theatre',
    duration: '3h 00min',
    rating: 'R',
    imdbRating: '8.9',
    ticketPrice: 20.00,
    badge: 'LIMITED',
    badgeColor: '#7c3aed',
    format: '70mm Reel Projection',
    genre: ['Biography', 'Drama', 'History'],
    director: 'Christopher Nolan',
    cast: ['Cillian Murphy', 'Emily Blunt', 'Matt Damon', 'Robert Downey Jr.'],
    poster: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=600&q=80',
    backdrop: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    description: 'The pulse-pounding story of J. Robert Oppenheimer and the Manhattan Project that ushered in the atomic age.',
    highlight: 'Captured in large-format 65mm & IMAX black-and-white analog photography.',
  },
  deadpool: {
    id: 'deadpool',
    title: 'Deadpool & Wolverine',
    time: '9:15 PM',
    showtimes: ['4:00 PM', '6:45 PM', '9:15 PM'],
    venue: 'Vue Cinema West End',
    screen: 'Screen 3 · Recliner Luxe',
    duration: '2h 08min',
    rating: 'R',
    imdbRating: '7.8',
    ticketPrice: 16.50,
    badge: 'TRENDING',
    badgeColor: '#e11d48',
    format: '4K Laser & Recliner',
    genre: ['Action', 'Comedy', 'Superhero'],
    director: 'Shawn Levy',
    cast: ['Ryan Reynolds', 'Hugh Jackman', 'Emma Corrin', 'Matthew Macfadyen'],
    poster: 'https://static1.cbrimages.com/wordpress/wp-content/uploads/2024/10/deadpool-and-wolverine-20th-century.jpg',
    backdrop: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1200&q=80',
    description: 'A listless Wade Wilson is pulled out of civilian retirement by the TVA to save his timeline with a very reluctant Wolverine.',
    highlight: 'Ultra-plush leather electric recliners with personal snack tables.',
  },
  interstellar: {
    id: 'interstellar',
    title: 'Interstellar (10th Anniversary IMAX)',
    time: '7:45 PM',
    showtimes: ['3:30 PM', '7:45 PM'],
    venue: 'Odeon IMAX Victoria',
    screen: 'Auditorium A · IMAX 4K Dual Laser',
    duration: '2h 49min',
    rating: 'PG-13',
    imdbRating: '8.7',
    ticketPrice: 22.00,
    badge: 'ANNIVERSARY',
    badgeColor: '#2563eb',
    format: 'IMAX Dual Laser 12-Track',
    genre: ['Sci-Fi', 'Adventure', 'Drama'],
    director: 'Christopher Nolan',
    cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain', 'Michael Caine'],
    poster: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=600&q=80',
    backdrop: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1200&q=80',
    description: 'A team of explorers travel through a newly discovered wormhole in space to ensure humanity’s survival.',
    highlight: 'Remastered in 4K Dual Laser with Hans Zimmer’s thunderous pipe organ score.',
  },
};

/**
 * Helper to generate random occupied seats for realistic cinema state
 */
export function generateRandomOccupiedSeats(total = TOTAL_SEATS, occupiedCount = 8) {
  const available = new Array(total).fill(true);
  let done = 0;
  while (done < occupiedCount) {
    const idx = Math.floor(Math.random() * total);
    if (available[idx]) {
      available[idx] = false;
      done++;
    }
  }
  return available;
}

/**
 * Calculate Seat Row & Col
 */
export function getSeatDetails(seatIndex) {
  const row = Math.floor(seatIndex / COLS);
  const col = seatIndex % COLS;
  const label = `${ROW_LABELS[row] || '?'}${col + 1}`;
  return { row, col, label, seatNumber: seatIndex + 1 };
}

/**
 * SITM AI Seat Optimizer Algorithm:
 * Evaluates contiguous blocks of size N based on viewing distance to center and row legroom.
 */
export function scoreSeatBlock(seatIndices) {
  let total = 0;
  for (let i = 0; i < seatIndices.length; i++) {
    const idx = seatIndices[i];
    const row = Math.floor(idx / COLS);
    const col = idx % COLS;

    // Center distance (cols 0-7, center is 3.5)
    const centerDist = Math.abs(col - 3.5);
    const viewScore = 10 - centerDist * 2.2;

    // Row legroom score (Row A / 0 has highest legroom, back rows have standard)
    let legScore = 0;
    if (row === 0) legScore = 9;
    else if (row === 1) legScore = 7;
    else if (row === 2) legScore = 6;
    else if (row === 3) legScore = 4;
    else if (row === 4) legScore = 2;
    else legScore = 0;

    total += viewScore + legScore;
  }
  return Number((total / seatIndices.length).toFixed(2));
}

/**
 * Generate human-readable descriptors for seat position
 */
export function describeSeatBlock(row, startCol, groupSize) {
  const centerDist = Math.abs(startCol + groupSize / 2 - 3.5);
  const view = centerDist < 1.5 ? 'Center view' : centerDist < 2.8 ? 'Good view' : 'Side view';
  const leg = row === 0 ? 'Extra legroom' : row <= 2 ? 'Good legroom' : 'Standard legroom';

  let tag = 'Balanced';
  if (view === 'Center view' && leg === 'Extra legroom') tag = 'Best Overall';
  else if (view === 'Center view') tag = 'Best View';
  else if (leg === 'Extra legroom') tag = 'Extra Legroom';

  return { view, leg, tag };
}

/**
 * Find the top 3 best contiguous seat blocks for groupSize N on a given availability grid
 */
export function findBestBlocks(availableGrid, groupSize = 4) {
  const blocks = [];

  // 1. Check horizontal contiguous blocks (preferred for groups)
  for (let row = 0; row < ROWS; row++) {
    for (let start = 0; start <= COLS - groupSize; start++) {
      const seats = [];
      let valid = true;
      for (let c = start; c < start + groupSize; c++) {
        const idx = row * COLS + c;
        if (!availableGrid[idx]) {
          valid = false;
          break;
        }
        seats.push(idx);
      }
      if (valid && seats.length === groupSize) {
        const score = scoreSeatBlock(seats);
        const desc = describeSeatBlock(row, start, groupSize);
        blocks.push({
          seats,
          score,
          row,
          startCol: start,
          view: desc.view,
          leg: desc.leg,
          tag: desc.tag,
          votes: 0,
        });
      }
    }
  }

  // 2. If fewer than 3 blocks found, check vertical adjacent blocks
  if (blocks.length < 3) {
    for (let col = 0; col < COLS; col++) {
      for (let startRow = 0; startRow <= ROWS - groupSize; startRow++) {
        const seats = [];
        let valid = true;
        for (let r = startRow; r < startRow + groupSize; r++) {
          const idx = r * COLS + col;
          if (!availableGrid[idx]) {
            valid = false;
            break;
          }
          seats.push(idx);
        }
        if (valid && seats.length === groupSize) {
          const score = scoreSeatBlock(seats);
          const desc = describeSeatBlock(startRow, col, groupSize);
          const duplicate = blocks.some((b) => b.seats.join(',') === seats.join(','));
          if (!duplicate) {
            blocks.push({
              seats,
              score,
              row: startRow,
              startCol: col,
              view: desc.view,
              leg: desc.leg,
              tag: desc.tag,
              votes: 0,
            });
          }
        }
      }
    }
  }

  // Sort descending by algorithm score and pick top 3
  blocks.sort((a, b) => b.score - a.score);
  return blocks.slice(0, 3);
}

/**
 * In-Memory Database Store
 */
class SITMDatabase {
  constructor() {
    this.movies = { ...INITIAL_MOVIES };
    this.movieSeatGrids = {};
    this.sessions = new Map();
    this.bookings = [];

    // Initialize random initial seats for each movie
    for (const movieId of Object.keys(this.movies)) {
      this.movieSeatGrids[movieId] = generateRandomOccupiedSeats(TOTAL_SEATS, 8);
    }
  }

  /**
   * Get all movies with optional filter
   */
  getAllMovies({ search = '', genre = '', format = '' } = {}) {
    let list = Object.values(this.movies);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((m) => m.title.toLowerCase().includes(q) || m.venue.toLowerCase().includes(q));
    }
    if (genre) {
      list = list.filter((m) => m.genre && m.genre.some((g) => g.toLowerCase() === genre.toLowerCase()));
    }
    if (format) {
      list = list.filter((m) => m.format && m.format.toLowerCase().includes(format.toLowerCase()));
    }
    return list;
  }

  /**
   * Get a movie by ID
   */
  getMovie(movieId) {
    return this.movies[movieId] || null;
  }

  /**
   * Get current seating state for a movie
   */
  getMovieSeats(movieId) {
    if (!this.movieSeatGrids[movieId]) {
      this.movieSeatGrids[movieId] = generateRandomOccupiedSeats(TOTAL_SEATS, 8);
    }
    return [...this.movieSeatGrids[movieId]];
  }

  /**
   * Create a new Group Voting Session
   */
  createSession({ movieId = 'spiderman', groupSize = 4, organizerName = 'Stranger Coordinator' } = {}) {
    const movie = this.getMovie(movieId);
    if (!movie) {
      throw new Error(`Movie with ID "${movieId}" not found.`);
    }

    const sessionId = uuidv4().substring(0, 8);
    const available = this.getMovieSeats(movieId);
    const suggestions = findBestBlocks(available, groupSize);

    const session = {
      id: sessionId,
      movieId,
      movie,
      groupSize: Number(groupSize),
      organizerName,
      available: [...available],
      suggestions,
      votes: {}, // { voterId: { optionIndex, voterName, votedAt } }
      voteCounts: suggestions.map(() => 0),
      status: 'ready', // 'ready' | 'voting' | 'ended' | 'booked'
      winnerOptionIndex: null,
      winningSeats: [],
      timerSeconds: 120,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 120 * 1000).toISOString(),
      bookings: [],
    };

    this.sessions.set(sessionId, session);
    return session;
  }

  /**
   * Get active session by ID
   */
  getSession(sessionId) {
    return this.sessions.get(sessionId) || null;
  }

  /**
   * Refresh / Find seats for a session
   */
  findSeatsForSession(sessionId, groupSize) {
    const session = this.getSession(sessionId);
    if (!session) return null;

    if (groupSize) {
      session.groupSize = Number(groupSize);
    }

    session.suggestions = findBestBlocks(session.available, session.groupSize);
    session.votes = {};
    session.voteCounts = session.suggestions.map(() => 0);
    session.status = 'ready';
    session.winnerOptionIndex = null;
    session.winningSeats = [];
    return session;
  }

  /**
   * Start voting on a session
   */
  startVoting(sessionId, durationSeconds = 120) {
    const session = this.getSession(sessionId);
    if (!session) return null;

    if (session.suggestions.length < 2) {
      session.suggestions = findBestBlocks(session.available, session.groupSize);
    }

    session.status = 'voting';
    session.timerSeconds = durationSeconds;
    session.votes = {};
    session.voteCounts = session.suggestions.map(() => 0);
    session.expiresAt = new Date(Date.now() + durationSeconds * 1000).toISOString();
    return session;
  }

  /**
   * Cast a vote in a session
   */
  castVote(sessionId, { voterId = uuidv4().substring(0, 6), voterName = 'Guest', optionIndex }) {
    const session = this.getSession(sessionId);
    if (!session) throw new Error('Session not found');

    if (session.status !== 'voting' && session.status !== 'ready') {
      throw new Error(`Voting is not currently active for this session (status: ${session.status}).`);
    }

    if (optionIndex < 0 || optionIndex >= session.suggestions.length) {
      throw new Error(`Invalid option index ${optionIndex}. Must be between 0 and ${session.suggestions.length - 1}.`);
    }

    // Record or update vote
    session.votes[voterId] = {
      optionIndex,
      voterName,
      votedAt: new Date().toISOString(),
    };

    // Recompute vote counts
    session.voteCounts = session.suggestions.map(() => 0);
    Object.values(session.votes).forEach((vote) => {
      if (session.voteCounts[vote.optionIndex] !== undefined) {
        session.voteCounts[vote.optionIndex]++;
        session.suggestions[vote.optionIndex].votes = session.voteCounts[vote.optionIndex];
      }
    });

    const totalVotes = Object.values(session.votes).length;
    // If all members in group voted, auto end voting
    if (totalVotes >= session.groupSize) {
      this.endVoting(sessionId);
    }

    return session;
  }

  /**
   * End voting early or on timer expire and determine the winning option
   */
  endVoting(sessionId) {
    const session = this.getSession(sessionId);
    if (!session) return null;

    session.status = 'ended';

    let maxVotes = -1;
    let winnerIdx = -1;

    for (let i = 0; i < session.suggestions.length; i++) {
      const votes = session.voteCounts[i] || 0;
      if (votes > maxVotes) {
        maxVotes = votes;
        winnerIdx = i;
      }
    }

    // Tie breaker based on algorithm score
    const tied = [];
    for (let i = 0; i < session.suggestions.length; i++) {
      if ((session.voteCounts[i] || 0) === maxVotes) {
        tied.push(i);
      }
    }

    if (tied.length > 1) {
      let bestScore = -1;
      for (const i of tied) {
        if (session.suggestions[i].score > bestScore) {
          bestScore = session.suggestions[i].score;
          winnerIdx = i;
        }
      }
    }

    if (winnerIdx >= 0 && maxVotes > 0) {
      session.winnerOptionIndex = winnerIdx;
      session.winningSeats = [...session.suggestions[winnerIdx].seats];
    } else if (session.suggestions.length > 0) {
      // Default to top scoring option if no votes cast
      session.winnerOptionIndex = 0;
      session.winningSeats = [...session.suggestions[0].seats];
    }

    return session;
  }

  /**
   * Book tickets (either full group booking or individual payment)
   */
  bookSeats(sessionId, { seatIndices, bookedBy = 'Stranger In The Middle Agent', paymentMethod = 'card' } = {}) {
    const session = this.getSession(sessionId);
    if (!session) throw new Error('Session not found');

    const seatsToBook = seatIndices || session.winningSeats;
    if (!seatsToBook || seatsToBook.length === 0) {
      throw new Error('No seats selected to book.');
    }

    // Validate that all seats are still available
    const unavailableSeats = seatsToBook.filter((idx) => !session.available[idx]);
    if (unavailableSeats.length > 0) {
      const seatNames = unavailableSeats.map((idx) => getSeatDetails(idx).label).join(', ');
      throw new Error(`Seats ${seatNames} have already been booked by another customer.`);
    }

    // Mark seats as taken in session and global movie state
    seatsToBook.forEach((idx) => {
      session.available[idx] = false;
      if (this.movieSeatGrids[session.movieId]) {
        this.movieSeatGrids[session.movieId][idx] = false;
      }
    });

    const bookingConfirmation = {
      bookingId: 'SITM-' + uuidv4().substring(0, 8).toUpperCase(),
      sessionId: session.id,
      movieId: session.movieId,
      movieTitle: session.movie.title,
      venue: session.movie.venue,
      screen: session.movie.screen,
      showtime: session.movie.time,
      poster: session.movie.poster,
      format: session.movie.format,
      seats: seatsToBook.map((idx) => ({
        index: idx,
        seatNumber: idx + 1,
        label: getSeatDetails(idx).label,
      })),
      seatLabels: seatsToBook.map((idx) => getSeatDetails(idx).label).join(', '),
      ticketCount: seatsToBook.length,
      ticketPrice: session.movie.ticketPrice,
      totalPrice: Number((seatsToBook.length * session.movie.ticketPrice).toFixed(2)),
      bookedBy,
      paymentMethod,
      timestamp: new Date().toISOString(),
    };

    session.bookings.push(bookingConfirmation);
    this.bookings.push(bookingConfirmation);
    session.status = 'booked';

    return {
      success: true,
      booking: bookingConfirmation,
      session,
    };
  }

  /**
   * Reset session
   */
  resetSession(sessionId) {
    const session = this.getSession(sessionId);
    if (!session) return null;

    session.available = generateRandomOccupiedSeats(TOTAL_SEATS, 8);
    session.suggestions = findBestBlocks(session.available, session.groupSize);
    session.votes = {};
    session.voteCounts = session.suggestions.map(() => 0);
    session.status = 'ready';
    session.winnerOptionIndex = null;
    session.winningSeats = [];
    return session;
  }

  /**
   * Get all confirmed bookings
   */
  getAllBookings() {
    return [...this.bookings];
  }

  /**
   * Get single booking by ID
   */
  getBooking(bookingId) {
    return this.bookings.find((b) => b.bookingId === bookingId) || null;
  }

  /**
   * Cancel a booking and release its seats back to the session and movie.
   */
  cancelBooking(bookingId) {
    const bookingIndex = this.bookings.findIndex((booking) => booking.bookingId === bookingId);
    if (bookingIndex === -1) return null;

    const [booking] = this.bookings.splice(bookingIndex, 1);
    const session = this.getSession(booking.sessionId);

    if (session) {
      session.bookings = session.bookings.filter((item) => item.bookingId !== bookingId);
      booking.seats.forEach(({ index }) => {
        session.available[index] = true;
        if (this.movieSeatGrids[session.movieId]) {
          this.movieSeatGrids[session.movieId][index] = true;
        }
      });
      session.suggestions = findBestBlocks(session.available, session.groupSize);
      session.status = session.bookings.length ? 'booked' : 'ready';
      session.winnerOptionIndex = null;
      session.winningSeats = [];
    }

    return booking;
  }
}

// Global Singleton Instance
export const db = new SITMDatabase();
export default db;
