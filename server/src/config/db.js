// const mongoose = require('mongoose');
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const fullURI = `${process.env.MONGO_URI}`
    await mongoose.connect(fullURI);
    // console.log(fullURI);
    
    console.log("Mongo connected");
  } catch (err) {
    console.error("DB connection error", err);
    process.exit(1);
  }
};

export default connectDB;
