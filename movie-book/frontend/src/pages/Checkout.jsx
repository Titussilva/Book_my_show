import { useLocation, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from '../utils/axiosInstance';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiShield, FiLock, FiArrowRight } from 'react-icons/fi';

const Checkout = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);

  // If no state, redirect back
  if (!state || !state.show) {
    navigate('/');
    return null;
  }

  const { show, selectedSeats, totalAmount } = state;
  const grandTotal = totalAmount + selectedSeats.length * 20;

  const handlePayNow = async () => {
    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };

      // 1. Create Pending Order on Backend
      const { data: orderData } = await axios.post(
        '/api/bookings',
        {
          showId: show._id,
          seats: selectedSeats,
          totalAmount,
        },
        config
      );

      const generatedPaymentId = `pay_rzp_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      // 2. Verify payment on Backend
      await axios.post(
        '/api/bookings/verify',
        {
          razorpay_order_id: orderData.orderId,
          razorpay_payment_id: generatedPaymentId,
          razorpay_signature: 'mock_signature',
          bookingId: orderData.bookingId,
        },
        config
      );

      // 3. Show Razorpay Payment Successful Modal
      setPaymentDetails({
        paymentId: generatedPaymentId,
        orderId: orderData.orderId,
        amount: grandTotal,
        movieTitle: show.movie.title,
        seats: selectedSeats.join(', '),
      });
      
      setShowSuccessModal(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error processing payment');
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = () => {
    toast.success('Ticket Confirmed!');
    navigate('/profile');
  };

  return (
    <div className="min-h-screen pt-24 px-4 max-w-3xl mx-auto pb-16">
      <h1 className="text-3xl font-bold mb-8">Booking Summary</h1>
      
      <div className="glass-panel p-8 rounded-3xl border border-gray-800 shadow-2xl">
        <div className="flex gap-6 border-b border-gray-800 pb-6 mb-6">
          <img src={show.movie.poster} alt={show.movie.title} className="w-24 h-36 object-cover rounded-xl shadow-lg border border-gray-700" />
          <div>
            <h2 className="text-2xl font-bold text-white">{show.movie.title}</h2>
            <p className="text-gray-400 mt-1">{show.theatre.name}, {show.theatre.city}</p>
            <p className="text-gray-400 text-sm">{show.screen.name}</p>
            <p className="text-primary font-semibold mt-3 flex items-center gap-2 text-sm md:text-base">
              <span>📅 {new Date(show.date).toLocaleDateString()}</span>
              <span>⏰ {show.time}</span>
            </p>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex justify-between text-sm md:text-base">
            <span className="text-gray-400">Selected Seats</span>
            <span className="font-semibold text-white">{selectedSeats.join(', ')}</span>
          </div>
          <div className="flex justify-between text-sm md:text-base">
            <span className="text-gray-400">Tickets ({selectedSeats.length})</span>
            <span className="font-semibold text-white">₹{totalAmount}</span>
          </div>
          <div className="flex justify-between text-sm md:text-base">
            <span className="text-gray-400">Convenience Fee</span>
            <span className="font-semibold text-white">₹{(selectedSeats.length * 20).toFixed(2)}</span>
          </div>
          <div className="border-t border-gray-800 pt-4 flex justify-between text-xl font-bold">
            <span className="text-white">Grand Total</span>
            <span className="text-primary">₹{grandTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Razorpay Trust Badge */}
        <div className="mb-8 p-4 rounded-2xl bg-gray-900/80 border border-gray-800 flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <FiShield className="text-emerald-400 text-base" />
            <span>256-Bit Encrypted Secure Checkout</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-gray-300">
            <span>Powered by</span>
            <span className="text-blue-400 font-extrabold tracking-wider">Razorpay</span>
          </div>
        </div>

        {/* Single Pay Action Button */}
        <button 
          onClick={handlePayNow}
          disabled={loading}
          className="w-full py-4.5 bg-gradient-to-r from-primary via-red-600 to-orange-500 rounded-xl font-bold text-white text-lg shadow-[0_0_25px_rgba(229,9,20,0.4)] hover:shadow-[0_0_35px_rgba(229,9,20,0.6)] transition-all transform active:scale-98 flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {loading ? (
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              <span>Connecting to Razorpay...</span>
            </div>
          ) : (
            <>
              <FiLock className="text-lg" />
              <span>Pay ₹{grandTotal.toFixed(2)} via Razorpay</span>
            </>
          )}
        </button>
      </div>

      {/* Razorpay Payment Successful Modal Overlay */}
      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white text-gray-900 rounded-3xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden"
            >
              {/* Razorpay Branding Header */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-black flex items-center justify-center text-sm shadow">
                    R
                  </div>
                  <span className="font-extrabold text-blue-900 text-lg tracking-tight">Razorpay</span>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Payment Verified
                </span>
              </div>

              {/* Animated Green Checkmark Icon */}
              <div className="flex flex-col items-center text-center mb-6">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2, stiffness: 200 }}
                  className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-500 flex items-center justify-center mb-4 shadow-inner"
                >
                  <FiCheckCircle className="text-5xl stroke-[2.5]" />
                </motion.div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Payment Successful!</h2>
                <p className="text-sm text-gray-500">Your transaction has been completed successfully.</p>
              </div>

              {/* Transaction Details Box */}
              <div className="bg-gray-50 rounded-2xl p-4 space-y-3 border border-gray-100 text-xs font-medium mb-6">
                <div className="flex justify-between items-center text-gray-500">
                  <span>Amount Paid</span>
                  <span className="text-gray-900 font-bold text-base text-emerald-600">₹{paymentDetails?.amount?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-gray-500 border-t border-gray-200/60 pt-2">
                  <span>Payment ID</span>
                  <span className="font-mono text-gray-800 font-bold select-all">{paymentDetails?.paymentId}</span>
                </div>
                <div className="flex justify-between items-center text-gray-500">
                  <span>Movie</span>
                  <span className="text-gray-800 font-semibold truncate max-w-[180px]">{paymentDetails?.movieTitle}</span>
                </div>
                <div className="flex justify-between items-center text-gray-500">
                  <span>Seats</span>
                  <span className="text-gray-800 font-semibold">{paymentDetails?.seats}</span>
                </div>
              </div>

              {/* Redirect Action Button */}
              <button
                onClick={handleFinish}
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 transition-all flex items-center justify-center gap-2 text-base"
              >
                <span>View Ticket & Booking Details</span>
                <FiArrowRight className="text-lg" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Checkout;
