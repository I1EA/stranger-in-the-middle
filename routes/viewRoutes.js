import express from 'express';
import db from '../db.js';
import catchAsync from '../utils/catchAsync.js';

const router = express.Router();

/**
 * @route   GET /
 * @desc    Render home view with movie catalog and SITM coordinator
 */
router.get(
  '/',
  catchAsync(async (req, res) => {
    const movies = db.getAllMovies();
    res.render('index', {
      movies,
      initialSessionId: null,
    });
  })
);

/**
 * @route   GET /session/:id
 * @desc    Render group voting session view for direct links
 */
router.get(
  '/session/:id',
  catchAsync(async (req, res) => {
    const movies = db.getAllMovies();
    const session = db.getSession(req.params.id);
    res.render('index', {
      movies,
      initialSessionId: req.params.id,
      session,
    });
  })
);

export default router;
