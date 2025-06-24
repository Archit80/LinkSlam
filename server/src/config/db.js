// const mongoose = require('mongoose');
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Mongo connected");
  } catch (err) {
    console.error("DB connection error", err);
    process.exit(1);
  }
};

export default connectDB;
