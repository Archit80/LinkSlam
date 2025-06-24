import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

//SIGN UP FUNCTION (NEW USER)

export const signup = async (req, res) => {
  const { email, password, name } = req.body;
  try {
    //VALIDATE INPUTS
    if (!email || !password || !name) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    //FLOW 1: if already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters" });
    }

    //FLOW 2: doesnt exist, create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email,
      password: hashedPassword,
      name,
    });

    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    // return res.status(201).json({
    //   user: {
    //     id: newUser._id,
    //     email: newUser.email,
    //     name: newUser.name,
    //   },
    //   token,
    // });

     return res
      .cookie("token", token, {
        httpOnly: true,
        secure: false,
        // secure: process.env.NODE_ENV === "production",
        sameSite: 'none', //bcoz frontend on vercel and backend on render
        maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 days
      })
      .status(201)
      .json({
        user: {
          id: newUser._id,
          email: newUser.email,
          name: newUser.name,
        },
      });

  } catch (error) {
    console.error("Error during signup:", error);
    return res.status(500).json({ message: "sign up error", err });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    //VALIDATE INPUTS
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    //CHECK IF USER EXISTS
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      //USER NOT FOUND
      return res.status(404).json({ message: "User not found" });
    }

    //USER FOUND, CHECK PASSWORD
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordValid) {
      //PASSWORD NOT VALID
      return res
        .status(401)
        .json({ message: "Either email or password is incorrect" });
    }

    //PASSWORD VALID, GENERATE JWT TOKEN
    const token = jwt.sign({ id: existingUser._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    // return res.status(200).json({
    //   user: {
    //     id: existingUser._id,
    //     email: existingUser.email,
    //     name: existingUser.name,
    //   },
    //   token,
    // });
    return res
      .cookie("token", token, {
        httpOnly: true,
        secure: false,
        // secure: process.env.NODE_ENV === "production",
        sameSite: 'none', //bcoz frontend on vercel and backend on render
        maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 days
      })
      .status(201)
      .json({
        user: {
          id: existingUser._id,
          email: existingUser.email,
          name: existingUser.name,
        },
      });

  } catch (error) {
    return res.status(500).json({ message: "Login error", error });
  }
};

export const logout = async (req, res) => {
    try {
        return res.status(200).clearCookie('token').json({ message: 'Logged out' });
    } catch (error) {
        return res.status(500).json({ message: 'Logout error', error });
    }

}