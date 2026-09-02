import express from 'express';
import db from '../db.js';
import catchAsync from '../utils/catchAsync.js';
import ExpressError from '../utils/ExpressError.js';

const router = express.Router();

/**
 * @route   POST /api/sessions
 * @desc    Create a new group voting session
 * @body    { movieId: string, groupSize: number, organizerName?: string }
 */
router.post(
  '/',
  catchAsync(async (req, res) => {
    const { movieId = 'spiderman', groupSize = 4, organizerName = 'Stranger Coordinator' } = req.body;

    const parsedSize = parseInt(groupSize, 10);
    if (isNaN(parsedSize) || parsedSize < 1 || parsedSize > 8) {
      throw new ExpressError('Group size must be between 1 and 8', 400);
    }

    const session = db.createSession({
      movieId,
      groupSize: parsedSize,
      organizerName,
    });

    res.status(201).json({
      status: 'success',
      message: 'Group session created successfully',
      data: { session },
    });
  })
);

/**
 * @route   GET /api/sessions/:id
 * @desc    Get session details and real-time state
 */
router.get(
  '/:id',
  catchAsync(async (req, res) => {
    const session = db.getSession(req.params.id);
    if (!session) {
      throw new ExpressError(`Session with ID '${req.params.id}' not found`, 404);
    }

    res.status(200).json({
      status: 'success',
      data: { session },
    });
  })
);

/**
 * @route   POST /api/sessions/:id/find-seats
 * @desc    Generate algorithm-scored seat block suggestions for group
 * @body    { groupSize?: number }
 */
router.post(
  '/:id/find-seats',
  catchAsync(async (req, res) => {
    const { groupSize } = req.body;
    const session = db.findSeatsForSession(req.params.id, groupSize);
    if (!session) {
      throw new ExpressError(`Session with ID '${req.params.id}' not found`, 404);
    }

    res.status(200).json({
      status: 'success',
      message: `Found ${session.suggestions.length} optimal seat options`,
      data: {
        suggestions: session.suggestions,
        session,
      },
    });
  })
);

/**
 * @route   POST /api/sessions/:id/start-voting
 * @desc    Start synchronized 2-minute voting countdown
 * @body    { durationSeconds?: number }
 */
router.post(
  '/:id/start-voting',
  catchAsync(async (req, res) => {
    const { durationSeconds = 120 } = req.body;
    const session = db.startVoting(req.params.id, durationSeconds);
    if (!session) {
      throw new ExpressError(`Session with ID '${req.params.id}' not found`, 404);
    }

    res.status(200).json({
      status: 'success',
      message: 'Voting session activated',
      data: { session },
    });
  })
);

/**
 * @route   POST /api/sessions/:id/vote
 * @desc    Cast a vote for an option
 * @body    { voterId?: string, voterName?: string, optionIndex: number }
 */
router.post(
  '/:id/vote',
  catchAsync(async (req, res) => {
    const { voterId, voterName, optionIndex } = req.body;

    if (optionIndex === undefined || optionIndex === null) {
      throw new ExpressError('optionIndex is required to cast a vote', 400);
    }

    const session = db.castVote(req.params.id, {
      voterId: voterId || req.session?.voterId,
      voterName: voterName || req.session?.voterName || 'Group Member',
      optionIndex: parseInt(optionIndex, 10),
    });

    res.status(200).json({
      status: 'success',
      message: `Vote recorded for Option ${parseInt(optionIndex, 10) + 1}`,
      data: { session },
    });
  })
);

/**
 * @route   POST /api/sessions/:id/end-voting
 * @desc    End voting session early and compute winning seats
 */
router.post(
  '/:id/end-voting',
  catchAsync(async (req, res) => {
    const session = db.endVoting(req.params.id);
    if (!session) {
      throw new ExpressError(`Session with ID '${req.params.id}' not found`, 404);
    }

    res.status(200).json({
      status: 'success',
      message: 'Voting ended. Winning seats calculated.',
      data: {
        winnerOptionIndex: session.winnerOptionIndex,
        winningSeats: session.winningSeats,
        session,
      },
    });
  })
);

/**
 * @route   POST /api/sessions/:id/book
 * @desc    Book seats (Stranger in the Middle agent booking or individual seat checkout)
 * @body    { seatIndices?: number[], bookedBy?: string, paymentMethod?: string }
 */
router.post(
  '/:id/book',
  catchAsync(async (req, res) => {
    const { seatIndices, bookedBy, paymentMethod } = req.body;

    const result = db.bookSeats(req.params.id, {
      seatIndices,
      bookedBy: bookedBy || 'Stranger In The Middle Agent',
      paymentMethod: paymentMethod || 'card',
    });

    res.status(200).json({
      status: 'success',
      message: 'Seats booked and confirmed successfully!',
      data: result,
    });
  })
);

/**
 * @route   POST /api/sessions/:id/reset
 * @desc    Reset session seating and voting state
 */
router.post(
  '/:id/reset',
  catchAsync(async (req, res) => {
    const session = db.resetSession(req.params.id);
    if (!session) {
      throw new ExpressError(`Session with ID '${req.params.id}' not found`, 404);
    }

    res.status(200).json({
      status: 'success',
      message: 'Session reset successfully',
      data: { session },
    });
  })
);

/**
 * @route   GET /api/sessions/:id/export
 * @desc    Export session data as JSON
 */
router.get(
  '/:id/export',
  catchAsync(async (req, res) => {
    const session = db.getSession(req.params.id);
    if (!session) {
      throw new ExpressError(`Session with ID '${req.params.id}' not found`, 404);
    }

    res.status(200).json({
      status: 'success',
      data: { session },
    });
  })
);

export default router;
