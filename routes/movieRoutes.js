import express from 'express';
import db from '../db.js';
import catchAsync from '../utils/catchAsync.js';
import ExpressError from '../utils/ExpressError.js';

const router = express.Router();

/**
 * @route   GET /api/movies
 * @desc    Get all available movies with showtimes and venues
 * @access  Public
 */
router.get(
  '/',
  catchAsync(async (req, res) => {
    const movies = db.getAllMovies();
    res.status(200).json({
      status: 'success',
      results: movies.length,
      data: { movies },
    });
  })
);

/**
 * @route   GET /api/movies/:id
 * @desc    Get single movie details
 * @access  Public
 */
router.get(
  '/:id',
  catchAsync(async (req, res) => {
    const movie = db.getMovie(req.params.id);
    if (!movie) {
      throw new ExpressError(`Movie with ID '${req.params.id}' not found`, 404);
    }
    const seats = db.getMovieSeats(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        movie,
        totalSeats: seats.length,
        availableSeatsCount: seats.filter(Boolean).length,
        seats,
      },
    });
  })
);

/**
 * @route   GET /api/movies/:id/seats
 * @desc    Get raw seating availability grid for a movie
 * @access  Public
 */
router.get(
  '/:id/seats',
  catchAsync(async (req, res) => {
    const movie = db.getMovie(req.params.id);
    if (!movie) {
      throw new ExpressError(`Movie with ID '${req.params.id}' not found`, 404);
    }
    const seats = db.getMovieSeats(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        movieId: req.params.id,
        seats,
      },
    });
  })
);

export default router;
