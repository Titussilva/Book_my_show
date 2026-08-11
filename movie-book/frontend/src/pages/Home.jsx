import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import MovieCard from '../components/MovieCard';

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm = searchParams.get('search') || '';

  const { data: movies, isLoading, error } = useQuery({
    queryKey: ['movies'],
    queryFn: async () => {
      const { data } = await axios.get('/api/movies');
      return data;
    }
  });

  const filteredMovies = movies?.filter((movie) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase().trim();
    const titleMatch = movie.title?.toLowerCase().includes(term);
    const genreMatch = movie.genre?.some((g) => g.toLowerCase().includes(term));
    const langMatch = movie.language?.some((l) => l.toLowerCase().includes(term));
    const directorMatch = movie.director?.toLowerCase().includes(term);
    return titleMatch || genreMatch || langMatch || directorMatch;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Error loading movies. Please try again later.
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1925&auto=format&fit=crop')] bg-cover bg-center bg-no-repeat"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-bg-main via-bg-main/80 to-transparent"></div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-white"
          >
            Experience Cinema <br /> <span className="text-gradient">Like Never Before</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-gray-300 mb-10"
          >
            Book tickets for the latest movies, enjoy exclusive offers, and get the best seats in the house.
          </motion.p>
        </div>
      </div>

      {/* Movies Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">
              {searchTerm ? 'Search Results' : 'Now Showing'}
            </h2>
            <div className="h-1 w-20 bg-primary rounded"></div>
          </div>
        </div>

        {searchTerm && (
          <div className="mb-8 flex items-center justify-between bg-gray-900/80 border border-gray-800 p-4 rounded-xl backdrop-blur-md">
            <p className="text-gray-300 text-sm md:text-base">
              Showing results for <span className="text-white font-bold">"{searchTerm}"</span> ({filteredMovies?.length || 0} found)
            </p>
            <button 
              onClick={() => setSearchParams({})} 
              className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-200 px-3 py-1.5 rounded-lg border border-gray-700 transition-colors"
            >
              Clear Search
            </button>
          </div>
        )}

        {filteredMovies?.length === 0 ? (
          <div className="text-center py-20 text-gray-400 glass-panel rounded-2xl border border-gray-800">
            <p className="text-xl font-semibold mb-2">No matching movies found</p>
            <p className="text-sm text-gray-500 mb-4">Try searching for a different title, genre, or director.</p>
            {searchTerm && (
              <button 
                onClick={() => setSearchParams({})} 
                className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-hover transition-colors"
              >
                Show All Movies
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredMovies?.map((movie, index) => (
              <motion.div
                key={movie._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <MovieCard movie={movie} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
