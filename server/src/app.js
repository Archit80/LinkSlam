import cors from 'cors';
import express from 'express';
import authRoutes from './routes/authRoutes.js';
import googleAuthRoutes from './routes/authGoogle.js';
import cookieParser from 'cookie-parser';
import session from "express-session";
import passport from "passport";
import "./config/passport.js"; 
import dotenv from "dotenv";
dotenv.config();


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use('/auth', authRoutes);
// app.use('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.use('/auth/google', googleAuthRoutes);

app.use(session({
  secret: process.env.SESSION_SECRET || "keyboardcat",
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

export default app;