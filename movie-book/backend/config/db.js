const mongoose = require('mongoose');
const dns = require('dns');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { importData } = require('../seeder');

// Use public DNS to resolve MongoDB Atlas SRV records when ISP/local DNS blocks them in Node
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // fallback if environment doesn't allow overriding servers
}

const connectDB = async () => {
  const maxRetries = 2;
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000, // Reduced to 5s to fail faster if Atlas is unreachable
      });
      console.log(`MongoDB Connected (Atlas): ${conn.connection.host}`);
      return;
    } catch (error) {
      retries++;
      console.error(`MongoDB connection attempt ${retries}/${maxRetries} failed: ${error.message}`);
      if (retries < maxRetries) {
        console.log(`Retrying in 2 seconds...`);
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }
  }

  console.warn('\n⚠️  Could not connect to MongoDB Atlas. Network might be blocking port 53 (DNS SRV) or IP is not whitelisted.');
  console.log('🔄  Falling back to In-Memory MongoDB Server so the UI works...\n');

  try {
    const mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    
    console.log(`MongoDB Connected (In-Memory): ${mongoUri}`);
    
    // Seed the database with our mock data since it's an empty memory database
    console.log('Seeding memory database with mock data...');
    await importData();
    console.log('✅  Memory Database Seeded successfully!');
    
  } catch (err) {
    console.error('Failed to start in-memory database:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
