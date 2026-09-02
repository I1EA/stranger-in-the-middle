import express from 'express';
import db from '../db.js';
import catchAsync from '../utils/catchAsync.js';
import ExpressError from '../utils/ExpressError.js';

const router = express.Router();

/**
 * @route   GET /api/bookings
 * @desc    Get all confirmed bookings
 */
router.get(
  '/',
  catchAsync(async (req, res) => {
    const bookings = db.getAllBookings();
    res.status(200).json({
      status: 'success',
      results: bookings.length,
      data: { bookings },
    });
  })
);

/**
 * @route   GET /api/bookings/:id
 * @desc    Get single booking confirmation
 */
router.get(
  '/:id',
  catchAsync(async (req, res) => {
    const booking = db.getBooking(req.params.id);
    if (!booking) {
      throw new ExpressError(`Booking confirmation with ID '${req.params.id}' not found`, 404);
    }
    res.status(200).json({
      status: 'success',
      data: { booking },
    });
  })
);

/**
 * @route   DELETE /api/bookings/:id
 * @desc    Cancel a booking and release its seats
 */
router.delete(
  '/:id',
  catchAsync(async (req, res) => {
    const booking = db.cancelBooking(req.params.id);
    if (!booking) {
      throw new ExpressError(`Booking '${req.params.id}' not found`, 404);
    }

    res.status(200).json({
      status: 'success',
      message: 'Booking cancelled and seats released.',
      data: { booking },
    });
  })
);

export default router;
