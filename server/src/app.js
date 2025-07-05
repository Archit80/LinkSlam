import cors from "cors";
import express from "express";
import authRoutes from "./routes/authRoutes.js";
import googleAuthRoutes from "./routes/authGoogle.js";
import linkRoutes from "./routes/linkRoutes.js";
import publicLinkRoutes from "./routes/publicLinkRoutes.js";
import userRoutes from "./routes/userRoutes.js";
// import {authMiddleware} from './middlewares/authMiddleware.js';
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import "./config/passport.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.set("trust proxy", 1); //  Required on Render

app.use(
  cors({
    origin: ["https://link-slam.vercel.app", "http://localhost:3000"], // both production and development
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "https://link-slam.vercel.app");
//   res.header("Access-Control-Allow-Credentials", "true");
//   res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
//   res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
//   next();
// });

app.options(
  "*",
  cors({
    origin: "https://link-slam.vercel.app",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "keyboardcat",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use("/auth", authRoutes);
// app.use('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.use("/auth/google", googleAuthRoutes);

app.use("/link", linkRoutes);

app.use("/public", publicLinkRoutes); // Public feed route

app.use("/users", userRoutes);
// app.use(authMiddleware); // Apply auth middleware globally

export default app;
