import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const SeatSelection = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [selectedSeats, setSelectedSeats] = useState([]);

  // Mock standard screen config for now
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  const columns = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

  // Fetch show details
  const { data: show, isLoading: isShowLoading } = useQuery({
    queryKey: ['show', showId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/shows/${showId}`);
      return data;
    },
    enabled: !!showId,
  });

  // Fetch booked seats
  const { data: bookedData, isLoading: isSeatsLoading } = useQuery({
    queryKey: ['seats', showId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/bookings/show/${showId}/seats`);
      return data;
    },
    enabled: !!showId,
    refetchInterval: 5000, // Polling every 5s to avoid double booking
  });

  const bookedSeats = bookedData?.bookedSeats || [];

  const handleSeatClick = (seatId) => {
    if (bookedSeats.includes(seatId)) return;
    
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatId));
    } else {
      if (selectedSeats.length >= 10) {
        toast.error('You can only select up to 10 seats');
        return;
      }
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const handleCheckout = () => {
    if (!user) {
      toast.error('Please login to book tickets');
      navigate('/login');
      return;
    }
    
    if (selectedSeats.length === 0) {
      toast.error('Please select at least one seat');
      return;
    }
    
    // Pass selected data to checkout page via state
    navigate('/checkout', { 
      state: { 
        show,
        selectedSeats,
        totalAmount: selectedSeats.length * (show?.price || 200)
      }
    });
  };

  if (isShowLoading || isSeatsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
      </div>
    );
  }

  if (!show) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 text-red-500">
        Show not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-4 pb-20 max-w-5xl mx-auto">
      
      {/* Show Info Header */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-gray-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{show.movie.title}</h1>
          <p className="text-gray-400">
            {show.theatre.name}, {show.theatre.city} | {show.screen.name}
          </p>
          <p className="text-primary font-semibold mt-2">
            {new Date(show.date).toLocaleDateString()} at {show.time}
          </p>
        </div>
        <div className="mt-4 md:mt-0 text-right">
          <p className="text-gray-400 mb-1">Ticket Price</p>
          <p className="text-2xl font-bold">₹{show.price}</p>
        </div>
      </div>

      {/* Screen Layout */}
      <div className="glass-panel p-8 rounded-3xl overflow-x-auto mb-10">
        <div className="w-[800px] mx-auto">
          {/* Screen Arc */}
          <div className="relative mb-16">
            <div className="h-10 border-t-4 border-primary/50 rounded-t-[50%] opacity-50 blur-[2px]"></div>
            <div className="h-10 border-t border-primary rounded-t-[50%] absolute top-0 w-full shadow-[0_-10px_20px_rgba(229,9,20,0.2)]"></div>
            <p className="text-center text-gray-500 text-sm mt-4 tracking-[0.5em] font-semibold">SCREEN</p>
          </div>

          {/* Seats Grid */}
          <div className="flex flex-col gap-4 items-center">
            {rows.map((row) => (
              <div key={row} className="flex items-center gap-4">
                <div className="w-6 font-bold text-gray-500 text-right">{row}</div>
                <div className="flex gap-2">
                  {columns.map((col) => {
                    const seatId = `${row}${col}`;
                    const isBooked = bookedSeats.includes(seatId);
                    const isSelected = selectedSeats.includes(seatId);
                    
                    // Add gap for aisle
                    const isAisle = col === 5 || col === 10;
                    
                    return (
                      <div key={seatId} className={`flex ${isAisle ? 'mr-6' : ''}`}>
                        <motion.button
                          whileHover={!isBooked ? { scale: 1.2 } : {}}
                          whileTap={!isBooked ? { scale: 0.9 } : {}}
                          onClick={() => handleSeatClick(seatId)}
                          disabled={isBooked}
                          className={`
                            w-8 h-8 rounded-t-lg rounded-b-sm text-xs font-semibold flex items-center justify-center transition-colors
                            ${isBooked ? 'bg-gray-800 text-gray-600 cursor-not-allowed border-t-2 border-gray-700' : 
                              isSelected ? 'bg-primary text-white shadow-[0_0_10px_rgba(229,9,20,0.6)]' : 
                              'bg-green-500/20 text-green-400 border border-green-500/50 hover:bg-green-500/40'}
                          `}
                        >
                          {col}
                        </motion.button>
                      </div>
                    );
                  })}
                </div>
                <div className="w-6 font-bold text-gray-500">{row}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex justify-center items-center gap-8 mt-12 pt-6 border-t border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-t-lg bg-green-500/20 border border-green-500/50"></div>
            <span className="text-sm text-gray-400">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-t-lg bg-primary"></div>
            <span className="text-sm text-gray-400">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-t-lg bg-gray-800 border-t-2 border-gray-700"></div>
            <span className="text-sm text-gray-400">Booked</span>
          </div>
        </div>
      </div>

      {/* Floating Action Bar */}
      {selectedSeats.length > 0 && (
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-0 left-0 w-full z-40 bg-bg-card/90 backdrop-blur-lg border-t border-gray-800 p-4"
        >
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">{selectedSeats.length} Seat(s) Selected</p>
              <p className="font-semibold text-lg">{selectedSeats.join(', ')}</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-sm text-gray-400 mb-1">Total Amount</p>
                <p className="font-bold text-2xl text-primary">₹{selectedSeats.length * show.price}</p>
              </div>
              <button 
                onClick={handleCheckout}
                className="px-8 py-3 bg-gradient-to-r from-primary to-orange-500 text-white font-bold rounded-xl hover:shadow-[0_0_20px_rgba(229,9,20,0.5)] transition-shadow"
              >
                Proceed
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SeatSelection;
