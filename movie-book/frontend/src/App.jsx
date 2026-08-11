import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

import MovieDetails from './pages/MovieDetails';
import Dashboard from './pages/admin/Dashboard';
import SeatSelection from './pages/SeatSelection';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';

function App() {
  return (
    <div className="App">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/book/:showId" element={<SeatSelection />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<Dashboard />} />
        </Routes>
      </main>
      {/* We'll add Footer here later */}
    </div>
  );
}

export default App;
