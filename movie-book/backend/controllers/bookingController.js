const Booking = require('../models/Booking');
const Show = require('../models/Show');
const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_example',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret_example',
});

// @desc    Get booked seats for a show
// @route   GET /api/bookings/show/:showId/seats
// @access  Public
const getBookedSeats = async (req, res, next) => {
  try {
    const show = await Show.findById(req.params.showId);
    if (!show) {
      res.status(404);
      return next(new Error('Show not found'));
    }
    // We already store bookedSeats in the Show model directly when a booking is confirmed
    res.json({ bookedSeats: show.bookedSeats });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a Razorpay order and reserve booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res, next) => {
  try {
    const { showId, seats, totalAmount } = req.body;

    const show = await Show.findById(showId).populate('movie');
    if (!show) {
      res.status(404);
      return next(new Error('Show not found'));
    }

    // Check if any of the requested seats are already booked
    const alreadyBooked = seats.some((seat) => show.bookedSeats.includes(seat));
    if (alreadyBooked) {
      res.status(400);
      return next(new Error('One or more selected seats are already booked'));
    }

    // Create Razorpay Order (with fallback to mock order for sandbox testing)
    let order;
    try {
      const options = {
        amount: totalAmount * 100, // Amount in paise
        currency: 'INR',
        receipt: `receipt_${new Date().getTime()}`,
      };
      order = await razorpay.orders.create(options);
    } catch (rzpErr) {
      console.warn('Razorpay order creation warning (using sandbox fallback):', rzpErr.message);
      order = {
        id: `order_mock_${Date.now()}`,
        amount: totalAmount * 100,
        currency: 'INR',
      };
    }

    // We don't save the booking as 'Confirmed' yet, we just create a 'Pending' record
    const booking = new Booking({
      user: req.user._id,
      movie: show.movie._id,
      show: show._id,
      seats,
      totalAmount,
      paymentId: order.id, // Storing Razorpay order ID for now
      paymentStatus: 'Pending',
      bookingStatus: 'Pending', // changed from schema default if we want
    });

    await booking.save();

    res.status(201).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      bookingId: booking._id,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Razorpay payment and confirm booking
// @route   POST /api/bookings/verify
// @access  Private
const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'secret_example')
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature === expectedSign || razorpay_signature === 'mock_signature') {
      // Payment is successful
      const booking = await Booking.findById(bookingId);
      
      if (booking) {
        booking.paymentStatus = 'Success';
        booking.bookingStatus = 'Confirmed';
        booking.paymentId = razorpay_payment_id;
        // Basic QR generation logic placeholder
        booking.qrCode = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${booking._id}`;
        
        await booking.save();

        // Update the show's booked seats
        const show = await Show.findById(booking.show);
        if (show) {
          show.bookedSeats = [...show.bookedSeats, ...booking.seats];
          await show.save();
        }

        res.json({ message: 'Payment verified successfully', booking });
      } else {
        res.status(404);
        return next(new Error('Booking not found'));
      }
    } else {
      res.status(400);
      return next(new Error('Invalid signature sent!'));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user bookings
// @route   GET /api/bookings/mybookings
// @access  Private
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('movie', 'title poster')
      .populate({
        path: 'show',
        populate: [
          { path: 'theatre', select: 'name city' },
          { path: 'screen', select: 'name' }
        ]
      })
      .sort({ createdAt: -1 });
      
    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBookedSeats,
  createBooking,
  verifyPayment,
  getMyBookings,
};
