const mongoose = require('mongoose');
require('dotenv').config();


const connectDB = async () => {
  try {

    console.log('Connecting to MongoDB...'); // Add for debugging
    console.log('Mongo URI:', process.env.MONGO_URI);

    // await mongoose.connect(process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1); // Exit on failure
  }
};



module.exports = connectDB;
