import dotenv from 'dotenv';
import app from './src/app.js';
import connectDB from './src/config/db.js';
import { connect } from 'mongoose';

dotenv.config();
connectDB();

const PORT = process.env.PORT || 8000;


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});