const express = require('express');
const router = express.Router();
const {
  getBookedSeats,
  createBooking,
  verifyPayment,
  getMyBookings,
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

router.get('/show/:showId/seats', getBookedSeats);
router.route('/').post(protect, createBooking);
router.post('/verify', protect, verifyPayment);
router.get('/mybookings', protect, getMyBookings);

module.exports = router;
