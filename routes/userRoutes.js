import express from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

/**
 * @route   GET /api/users/me
 * @desc    Get or generate an anonymous voter session ID
 */
router.get('/me', (req, res) => {
  if (!req.session.voterId) {
    req.session.voterId = 'voter_' + uuidv4().substring(0, 6);
  }

  res.status(200).json({
    status: 'success',
    data: {
      voterId: req.session.voterId,
      name: req.session.voterName || `Participant ${req.session.voterId.slice(-4)}`,
    },
  });
});

/**
 * @route   POST /api/users/profile
 * @desc    Set voter display name in session
 */
router.post('/profile', (req, res) => {
  const { name } = req.body;
  if (name) {
    req.session.voterName = name.trim();
  }
  res.status(200).json({
    status: 'success',
    data: {
      voterId: req.session.voterId || 'voter_' + uuidv4().substring(0, 6),
      name: req.session.voterName,
    },
  });
});

export default router;
