const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

const Movie = require('./models/Movie');
const Theatre = require('./models/Theatre');
const Screen = require('./models/Screen');
const Show = require('./models/Show');
const User = require('./models/User');
const Booking = require('./models/Booking');

const movies = require('./data/movies');

dotenv.config();
if (require.main === module) {
  connectDB();
}

const importData = async () => {
  try {
    await Movie.deleteMany();
    await Theatre.deleteMany();
    await Screen.deleteMany();
    await Show.deleteMany();
    await User.deleteMany();
    await Booking.deleteMany();

    const createdUsers = await User.create([
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin'
      },
      {
        name: 'Test User',
        email: 'user@example.com',
        password: 'password123',
        role: 'user'
      }
    ]);

    const adminUser = createdUsers[0]._id;

    const createdMovies = await Movie.insertMany(movies);

    const createdTheatres = await Theatre.create([
      {
        name: 'PVR Cinemas',
        city: 'Mumbai',
        address: 'Phoenix Marketcity, Kurla, Mumbai - 400070'
      },
      {
        name: 'INOX Leisure',
        city: 'Delhi',
        address: 'DLF Promenade, Vasant Kunj, New Delhi - 110070'
      },
      {
        name: 'Cinepolis',
        city: 'Bangalore',
        address: 'Forum Shantiniketan Mall, Whitefield, Bangalore - 560048'
      },
      {
        name: 'IMAX by PVR',
        city: 'Hyderabad',
        address: 'Prasads Multiplex, NTR Marg, Hyderabad - 500001'
      },
      {
        name: 'Miraj Cinemas',
        city: 'Chennai',
        address: 'Express Avenue Mall, Royapettah, Chennai - 600002'
      }
    ]);

    const createdScreens = await Screen.create([
      // PVR Mumbai Screens
      { name: 'Audi 1', theatre: createdTheatres[0]._id, rows: 8, columns: 16 },
      { name: 'Audi 2 (IMAX)', theatre: createdTheatres[0]._id, rows: 12, columns: 22 },
      { name: 'Audi 3 (4DX)', theatre: createdTheatres[0]._id, rows: 7, columns: 14 },
      // INOX Delhi Screens
      { name: 'Screen 1', theatre: createdTheatres[1]._id, rows: 8, columns: 18 },
      { name: 'Screen 2', theatre: createdTheatres[1]._id, rows: 10, columns: 20 },
      // Cinepolis Bangalore Screens
      { name: 'Hall A', theatre: createdTheatres[2]._id, rows: 9, columns: 16 },
      { name: 'Hall B (Gold)', theatre: createdTheatres[2]._id, rows: 6, columns: 12 },
      // IMAX Hyderabad Screens
      { name: 'IMAX Screen', theatre: createdTheatres[3]._id, rows: 14, columns: 24 },
      { name: 'Premium Screen', theatre: createdTheatres[3]._id, rows: 8, columns: 16 },
      // Miraj Chennai Screens
      { name: 'Screen 1', theatre: createdTheatres[4]._id, rows: 8, columns: 16 },
      { name: 'Screen 2', theatre: createdTheatres[4]._id, rows: 7, columns: 14 },
    ]);

    // Create Shows
    const d1 = new Date(); d1.setDate(d1.getDate() + 1);
    const d2 = new Date(); d2.setDate(d2.getDate() + 2);
    const d3 = new Date(); d3.setDate(d3.getDate() + 3);

    await Show.create([
      // Movie 0 - Dune Part Two
      { movie: createdMovies[0]._id, theatre: createdTheatres[0]._id, screen: createdScreens[1]._id, date: d1, time: '10:00', price: 600 },
      { movie: createdMovies[0]._id, theatre: createdTheatres[1]._id, screen: createdScreens[3]._id, date: d1, time: '14:00', price: 400 },
      { movie: createdMovies[0]._id, theatre: createdTheatres[3]._id, screen: createdScreens[7]._id, date: d2, time: '17:30', price: 700 },

      // Movie 1 - Deadpool & Wolverine
      { movie: createdMovies[1]._id, theatre: createdTheatres[0]._id, screen: createdScreens[0]._id, date: d1, time: '12:00', price: 450 },
      { movie: createdMovies[1]._id, theatre: createdTheatres[2]._id, screen: createdScreens[5]._id, date: d1, time: '18:00', price: 380 },
      { movie: createdMovies[1]._id, theatre: createdTheatres[4]._id, screen: createdScreens[9]._id, date: d2, time: '21:00', price: 350 },

      // Movie 2 - Oppenheimer
      { movie: createdMovies[2]._id, theatre: createdTheatres[1]._id, screen: createdScreens[4]._id, date: d1, time: '10:30', price: 320 },
      { movie: createdMovies[2]._id, theatre: createdTheatres[2]._id, screen: createdScreens[6]._id, date: d2, time: '15:00', price: 500 },

      // Movie 3 - Spider-Man Spider-Verse
      { movie: createdMovies[3]._id, theatre: createdTheatres[0]._id, screen: createdScreens[2]._id, date: d1, time: '11:00', price: 350 },
      { movie: createdMovies[3]._id, theatre: createdTheatres[3]._id, screen: createdScreens[8]._id, date: d2, time: '14:30', price: 420 },
      { movie: createdMovies[3]._id, theatre: createdTheatres[4]._id, screen: createdScreens[10]._id, date: d3, time: '17:00', price: 300 },

      // Movie 4 - Avatar Way of Water
      { movie: createdMovies[4]._id, theatre: createdTheatres[1]._id, screen: createdScreens[3]._id, date: d1, time: '16:00', price: 450, bookedSeats: ['B3','B4','C5'] },
      { movie: createdMovies[4]._id, theatre: createdTheatres[3]._id, screen: createdScreens[7]._id, date: d2, time: '20:00', price: 750 },

      // Movie 5 - The Dark Knight
      { movie: createdMovies[5]._id, theatre: createdTheatres[0]._id, screen: createdScreens[1]._id, date: d2, time: '12:30', price: 500 },
      { movie: createdMovies[5]._id, theatre: createdTheatres[2]._id, screen: createdScreens[5]._id, date: d2, time: '19:00', price: 350 },
      { movie: createdMovies[5]._id, theatre: createdTheatres[4]._id, screen: createdScreens[9]._id, date: d3, time: '21:30', price: 320 },

      // Movie 6 - Inception
      { movie: createdMovies[6]._id, theatre: createdTheatres[1]._id, screen: createdScreens[4]._id, date: d2, time: '13:00', price: 380 },
      { movie: createdMovies[6]._id, theatre: createdTheatres[3]._id, screen: createdScreens[8]._id, date: d3, time: '16:30', price: 460 },

      // Movie 7 - Interstellar
      { movie: createdMovies[7]._id, theatre: createdTheatres[0]._id, screen: createdScreens[0]._id, date: d2, time: '10:00', price: 350 },
      { movie: createdMovies[7]._id, theatre: createdTheatres[2]._id, screen: createdScreens[6]._id, date: d2, time: '20:30', price: 480 },

      // Movie 8 - Gladiator II
      { movie: createdMovies[8]._id, theatre: createdTheatres[4]._id, screen: createdScreens[10]._id, date: d1, time: '14:00', price: 380 },
      { movie: createdMovies[8]._id, theatre: createdTheatres[1]._id, screen: createdScreens[3]._id, date: d3, time: '18:30', price: 420 },

      // Movie 9 - The Batman
      { movie: createdMovies[9]._id, theatre: createdTheatres[0]._id, screen: createdScreens[2]._id, date: d3, time: '11:30', price: 320 },
      { movie: createdMovies[9]._id, theatre: createdTheatres[3]._id, screen: createdScreens[7]._id, date: d3, time: '22:00', price: 600, bookedSeats: ['D2','D3','D4'] },

      // Movie 10 - John Wick Chapter 4
      { movie: createdMovies[10]._id, theatre: createdTheatres[2]._id, screen: createdScreens[5]._id, date: d1, time: '20:00', price: 400 },
      { movie: createdMovies[10]._id, theatre: createdTheatres[4]._id, screen: createdScreens[9]._id, date: d3, time: '19:30', price: 360 },

      // Movie 11 - Transformers Rise of the Beasts
      { movie: createdMovies[11]._id, theatre: createdTheatres[1]._id, screen: createdScreens[4]._id, date: d1, time: '15:00', price: 300 },
      { movie: createdMovies[11]._id, theatre: createdTheatres[3]._id, screen: createdScreens[8]._id, date: d2, time: '12:00', price: 350 },
    ]);

    console.log('Data Imported!');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw error;
  }
};

const destroyData = async () => {
  try {
    await Movie.deleteMany();
    await Theatre.deleteMany();
    await Screen.deleteMany();
    await Show.deleteMany();
    await User.deleteMany();
    await Booking.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

if (require.main === module) {
  if (process.argv[2] === '-d') {
    destroyData();
  } else {
    importData().then(() => process.exit());
  }
}

module.exports = { importData, destroyData };
