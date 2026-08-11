import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiStar, FiClock } from 'react-icons/fi';

const MovieCard = ({ movie }) => {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      transition={{ duration: 0.3 }}
      className="glass-panel rounded-2xl overflow-hidden group relative"
    >
      <div className="aspect-[2/3] overflow-hidden relative">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <Link
            to={`/movie/${movie._id}`}
            className="w-full py-2 bg-gradient-to-r from-primary to-orange-500 text-center rounded-lg font-semibold text-white shadow-lg hover:shadow-primary/50 transition-shadow"
          >
            Book Now
          </Link>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1 truncate" title={movie.title}>{movie.title}</h3>
        <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
          <div className="flex items-center gap-1">
            <FiStar className="text-accent" />
            <span>{movie.rating ? movie.rating.toFixed(1) : 'New'}</span>
          </div>
          <div className="flex items-center gap-1">
            <FiClock />
            <span>{movie.duration}m</span>
          </div>
          <span className="border border-gray-600 px-1.5 py-0.5 rounded text-xs">
            {movie.ageRating}
          </span>
        </div>
        <div className="text-xs text-gray-500 truncate">
          {movie.genre.join(', ')}
        </div>
      </div>
    </motion.div>
  );
};

export default MovieCard;
