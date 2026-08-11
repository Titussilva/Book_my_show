import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FiClock, FiStar, FiCalendar, FiPlayCircle } from 'react-icons/fi';

const MovieDetails = () => {
  const { id } = useParams();

  const { data: movie, isLoading, error } = useQuery({
    queryKey: ['movie', id],
    queryFn: async () => {
      const { data } = await axios.get(`/api/movies/${id}`);
      return data;
    }
  });

  const { data: shows, isLoading: isShowsLoading } = useQuery({
    queryKey: ['shows', id],
    queryFn: async () => {
      const { data } = await axios.get(`/api/shows?movie=${id}`);
      return data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 text-red-500">
        Movie not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Backdrop Section */}
      <div className="relative h-[60vh] md:h-[80vh] w-full">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${movie.backdrop || movie.poster})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-bg-main via-bg-main/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-bg-main via-bg-main/40 to-transparent"></div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 relative -mt-32 md:-mt-64 flex flex-col md:flex-row gap-10">
        
        {/* Poster & Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-48 md:w-80 flex-shrink-0 mx-auto md:mx-0 z-10"
        >
          <div className="rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-gray-700">
            <img src={movie.poster} alt={movie.title} className="w-full h-auto object-cover" />
          </div>
          

          <a
            href={movie.trailerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex items-center justify-center gap-2 w-full py-3 bg-gray-800 hover:bg-gray-700 rounded-xl font-semibold transition-colors border border-gray-700"
          >
            <FiPlayCircle className="text-xl text-primary" /> Watch Trailer
          </a>
        </motion.div>

        {/* Movie Info */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex-1 z-10 md:pt-20"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4">{movie.title}</h1>
          
          <div className="flex flex-wrap items-center gap-6 mb-8 text-sm md:text-base text-gray-300">
            <div className="flex items-center gap-2">
              <FiStar className="text-accent text-xl" />
              <span className="font-bold text-white">{movie.rating ? movie.rating.toFixed(1) : 'NR'}</span>
              <span>/ 10</span>
            </div>
            <div className="flex items-center gap-2">
              <FiClock className="text-primary" />
              <span>{movie.duration} Minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <FiCalendar className="text-primary" />
              <span>{new Date(movie.releaseDate).toLocaleDateString()}</span>
            </div>
            <span className="border border-gray-500 px-2 py-1 rounded text-xs font-semibold">
              {movie.ageRating}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {movie.genre.map((g) => (
              <span key={g} className="px-4 py-1.5 bg-gray-800/80 backdrop-blur-sm rounded-full text-sm border border-gray-700">
                {g}
              </span>
            ))}
          </div>

          <div className="mb-10">
            <h3 className="text-xl font-bold mb-3">Synopsis</h3>
            <p className="text-gray-300 leading-relaxed text-lg">
              {movie.description}
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Cast</h3>
            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
              {movie.cast && movie.cast.length > 0 ? (
                movie.cast.map((actor, idx) => (
                  <div key={idx} className="flex-shrink-0 text-center w-24">
                    <div className="w-20 h-20 mx-auto rounded-full overflow-hidden mb-2 border-2 border-gray-700">
                      <img src={actor.image || 'https://via.placeholder.com/150'} alt={actor.name} className="w-full h-full object-cover" />
                    </div>
                    <p className="font-semibold text-sm truncate">{actor.name}</p>
                    <p className="text-xs text-gray-500 truncate">{actor.role}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">Cast information not available.</p>
              )}
            </div>
          </div>
          <div className="mt-10">
            <h3 className="text-xl font-bold mb-4">Available Shows & Theatres</h3>
            
            {isShowsLoading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : shows && shows.length > 0 ? (
              <div className="space-y-4">
                {shows.map((show) => (
                  <div key={show._id} className="glass-panel p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-gray-800">
                    <div>
                      <h4 className="font-bold text-lg text-white">{show.theatre.name}</h4>
                      <p className="text-sm text-gray-400">{show.theatre.city} | {show.screen.name}</p>
                      <p className="text-sm text-primary font-semibold mt-1">
                        {new Date(show.date).toLocaleDateString()} at {show.time}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-bold text-xl">₹{show.price}</p>
                      <Link
                        to={`/book/${show._id}`}
                        className="px-6 py-2 text-center bg-gradient-to-r from-primary to-orange-500 rounded-lg font-bold text-white shadow-[0_0_15px_rgba(229,9,20,0.3)] hover:shadow-[0_0_20px_rgba(229,9,20,0.5)] transition-all hover:scale-105"
                      >
                        Book Seats
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass-panel p-6 rounded-xl text-center text-gray-400 border border-gray-800">
                No shows currently available for this movie.
              </div>
            )}
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default MovieDetails;
