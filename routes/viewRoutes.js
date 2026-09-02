import express from 'express';
import db from '../db.js';
import catchAsync from '../utils/catchAsync.js';
import ExpressError from '../utils/ExpressError.js';

const router = express.Router();

/**
 * @route   GET /
 * @desc    Render cinematic home view with movie catalog, hero banner, and SITM launcher
 */
router.get(
  '/',
  catchAsync(async (req, res) => {
    const { genre, format, search } = req.query;
    const movies = db.getAllMovies({ genre, format, search });
    const recentBookings = db.getAllBookings().slice(-5).reverse();

    res.render('index', {
      title: 'Stranger In The Middle · AI Group Cinema Booking',
      movies,
      activeGenre: genre || 'all',
      activeFormat: format || 'all',
      searchQuery: search || '',
      recentBookings,
      initialSessionId: null,
    });
  })
);

/**
 * @route   GET /session
 * @desc    Redirect a room-code form submission to its session page
 */
router.get('/session', (req, res) => {
  const sessionId = typeof req.query.id === 'string' ? req.query.id.trim() : '';
  res.redirect(sessionId ? `/session/${encodeURIComponent(sessionId)}` : '/#movie-catalog');
});

/**
 * @route   GET /movies/:id
 * @desc    Render individual movie showcase & instant SITM session launcher
 */
router.get(
  '/movies/:id',
  catchAsync(async (req, res) => {
    const movie = db.getMovie(req.params.id);
    if (!movie) {
      throw new ExpressError(`Movie '${req.params.id}' not found`, 404);
    }
    const seats = db.getMovieSeats(req.params.id);
    const availableCount = seats.filter(Boolean).length;
    const otherMovies = db.getAllMovies().filter((m) => m.id !== req.params.id);

    res.render('movie', {
      title: `${movie.title} · Stranger In The Middle`,
      movie,
      availableCount,
      totalSeats: seats.length,
      otherMovies,
    });
  })
);

/**
 * @route   GET /session/:id
 * @desc    Render dedicated interactive Group Voting & AI Coordination Arena
 */
router.get(
  '/session/:id',
  catchAsync(async (req, res) => {
    const session = db.getSession(req.params.id);
    const movies = db.getAllMovies();

    if (!session) {
      throw new ExpressError(`Session '${req.params.id}' not found`, 404);
    }

    res.render('session', {
      title: `Group Booking: ${session.movie.title} · SITM Arena`,
      session,
      movies,
      sessionId: session.id,
    });
  })
);

/**
 * @route   GET /confirmation/:id
 * @desc    Render high-definition digital cinema ticket confirmation
 */
router.get(
  '/confirmation/:id',
  catchAsync(async (req, res) => {
    const booking = db.getBooking(req.params.id);
    if (!booking) {
      throw new ExpressError(`Booking confirmation '${req.params.id}' not found`, 404);
    }

    res.render('confirmation', {
      title: `Ticket Confirmed · ${booking.bookingId} · SITM`,
      booking,
    });
  })
);

/**
 * @route   GET /bookings
 * @desc    Render user's booking history and digital passes
 */
router.get(
  '/bookings',
  catchAsync(async (req, res) => {
    const bookings = db.getAllBookings().reverse();
    res.render('bookings', {
      title: 'My Cinema Bookings · Stranger In The Middle',
      bookings,
    });
  })
);

export default router;
