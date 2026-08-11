import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FiUsers, FiFilm, FiMonitor, FiMapPin } from 'react-icons/fi';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen pt-24 px-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
          <div className="p-4 bg-primary/20 rounded-xl text-primary text-2xl">
            <FiFilm />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Total Movies</p>
            <h3 className="text-2xl font-bold">12</h3>
          </div>
        </div>
        
        <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
          <div className="p-4 bg-accent/20 rounded-xl text-accent text-2xl">
            <FiMapPin />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Total Theatres</p>
            <h3 className="text-2xl font-bold">4</h3>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
          <div className="p-4 bg-blue-500/20 rounded-xl text-blue-500 text-2xl">
            <FiMonitor />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Active Shows</p>
            <h3 className="text-2xl font-bold">48</h3>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
          <div className="p-4 bg-green-500/20 rounded-xl text-green-500 text-2xl">
            <FiUsers />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Total Users</p>
            <h3 className="text-2xl font-bold">1,024</h3>
          </div>
        </div>
      </div>
      
      <div className="glass-panel p-8 rounded-2xl text-center text-gray-400 min-h-[40vh] flex items-center justify-center">
        Admin management sections (Movies, Theatres, Users, Shows) will be displayed here.
      </div>
    </div>
  );
};

export default Dashboard;
