import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiSearch, FiUser, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const navigate = useNavigate();

  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '');
  }, [searchParams]);

  // Handle scroll effect
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
      setIsScrolled(window.scrollY > 50);
    });
  }

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim()) {
      navigate(`/?search=${encodeURIComponent(query.trim())}`);
    } else {
      navigate('/');
    }
  };

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-bg-main/90 backdrop-blur-md shadow-lg shadow-black/50 py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold tracking-tighter">
          <span className="text-white">CINE</span>
          <span className="text-primary">MAGIC</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-gray-300 hover:text-white transition-colors font-medium">Home</Link>
          
          <div className="relative">
            <input 
              type="text" 
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search movies, genre..." 
              className="bg-bg-card border border-gray-700 rounded-full py-1.5 pl-4 pr-10 text-sm focus:outline-none focus:border-primary transition-colors text-white w-64"
            />
            <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* User Actions */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              {user.role === 'admin' && (
                <Link to="/admin" className="text-sm font-semibold text-accent hover:text-yellow-300 transition-colors">
                  Dashboard
                </Link>
              )}
              <div className="relative group cursor-pointer flex items-center space-x-2">
                <img src={user.avatar} alt="avatar" className="w-8 h-8 rounded-full border border-gray-600" />
                <span className="text-sm font-medium">{user.name.split(' ')[0]}</span>
                
                {/* Dropdown */}
                <div className="absolute top-10 right-0 w-48 bg-bg-card border border-gray-700 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden">
                  <Link to="/profile" className="flex items-center px-4 py-3 hover:bg-gray-800 transition-colors">
                    <FiUser className="mr-3" /> Profile
                  </Link>
                  <button onClick={handleLogout} className="w-full flex items-center px-4 py-3 hover:bg-gray-800 text-red-400 transition-colors text-left">
                    <FiLogOut className="mr-3" /> Logout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link to="/login" className="px-4 py-2 text-sm font-medium hover:text-primary transition-colors">
                Sign In
              </Link>
              <Link to="/register" className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-colors shadow-[0_0_10px_rgba(229,9,20,0.4)]">
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-2xl text-white focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-bg-card border-t border-gray-800 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-4 flex flex-col">
              <div className="relative w-full">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={handleSearch}
                  placeholder="Search movies, genre..." 
                  className="bg-bg-main border border-gray-700 rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none focus:border-primary transition-colors text-white w-full"
                />
                <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-300 hover:text-white">Home</Link>
              
              <div className="pt-4 border-t border-gray-800">
                {user ? (
                  <>
                    <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-gray-300 hover:text-white">Profile</Link>
                    {user.role === 'admin' && (
                      <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-accent">Admin Dashboard</Link>
                    )}
                    <button onClick={handleLogout} className="block py-2 text-red-400 w-full text-left">Logout</button>
                  </>
                ) : (
                  <div className="flex flex-col space-y-3">
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-center border border-gray-600 rounded-lg">Sign In</Link>
                    <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-center bg-primary rounded-lg">Sign Up</Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
