import { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Profile = () => {
  const { user } = useContext(AuthContext);

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['myBookings'],
    queryFn: async () => {
      const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      };
      const { data } = await axios.get('/api/bookings/mybookings', config);
      return data;
    },
    enabled: !!user,
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        Please login to view your profile.
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-4 max-w-5xl mx-auto pb-20">
      
      {/* Profile Header */}
      <div className="glass-panel p-8 rounded-3xl flex flex-col md:flex-row items-center gap-8 mb-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-accent"></div>
        {user.avatar && !user.avatar.includes('anonymous-avatar-icon') ? (
          <img src={user.avatar} alt="Profile" className="w-32 h-32 rounded-full border-4 border-gray-800 shadow-xl" onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} />
        ) : null}
        <div
          className="w-32 h-32 rounded-full border-4 border-gray-800 shadow-xl bg-primary items-center justify-center text-white text-5xl font-bold uppercase"
          style={{ display: (user.avatar && !user.avatar.includes('anonymous-avatar-icon')) ? 'none' : 'flex' }}
        >
          {user.name?.charAt(0)}
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
          <p className="text-gray-400">{user.email}</p>
          <span className="inline-block mt-3 px-3 py-1 bg-gray-800 rounded-full text-sm border border-gray-700 capitalize">
            {user.role}
          </span>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6">Booking History</h2>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : bookings && bookings.length > 0 ? (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              key={booking._id} 
              className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row gap-6 relative"
            >
              {booking.bookingStatus === 'Confirmed' && (
                <div className="absolute top-4 right-4 text-xs font-bold px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full">
                  Confirmed
                </div>
              )}
              
              <img src={booking.movie.poster} alt={booking.movie.title} className="w-24 md:w-32 rounded-lg object-cover" />
              
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-1">{booking.movie.title}</h3>
                <p className="text-gray-400 text-sm mb-4">
                  {booking.show.theatre.name}, {booking.show.theatre.city} | {booking.show.screen.name}
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Date</p>
                    <p className="font-semibold">{new Date(booking.show.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Time</p>
                    <p className="font-semibold">{booking.show.time}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Seats</p>
                    <p className="font-semibold">{booking.seats.join(', ')}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Total</p>
                    <p className="font-bold text-primary">₹{booking.totalAmount}</p>
                  </div>
                </div>

                {booking.qrCode && (
                  <div className="mt-4 pt-4 border-t border-gray-800 flex items-center justify-between">
                    <p className="text-sm text-gray-400">Show this QR code at the entrance</p>
                    <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors">
                      View QR Ticket
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 glass-panel rounded-2xl">
          <p className="text-gray-400 text-lg">You haven't booked any tickets yet.</p>
        </div>
      )}
    </div>
  );
};

export default Profile;
