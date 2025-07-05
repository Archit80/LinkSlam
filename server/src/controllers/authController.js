import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../config/cloudinary.js";

export const signup = async (req, res) => {
  const { email, password } = req.body;
  try {
    //VALIDATE INPUTS
    if (!email || !password ) {
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
    });

    // Use process.env.JWT_SECRET directly
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None", //bcoz frontend on vercel and backend on render
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .status(201)
      .json({
        user: {
          id: newUser._id,
          email: newUser.email,
        },
      });
  } catch (error) {
    console.error("Error during signup:", error);
    return res.status(500).json({ message: "sign up error", error });
  }
};

export const updateProfile = async (req, res) => {
  const { name, bio, username } = req.body;
  const userId = req.user.id; // auth middleware sets this
  
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
 
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser && existingUser._id.toString() !== userId) {
        return res.status(400).json({ message: "Username already taken" });
      }
    }

    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (bio !== undefined) updateFields.bio = bio;
    if (username !== undefined) updateFields.username = username;
    updateFields.isNewUser = false; 
    
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateFields,
      { new: true, runValidators: true }
    ).select("-password");

    // console.log("Updated User:", updatedUser);

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ message: "Internal server error", error });
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
    const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None", //bcoz frontend on vercel and backend on render
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .status(200)
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
    return res
      .status(200)
      .clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "None", // Add this for consistency
      })
      .json({ message: "Logged out" });
  } catch (error) {
    return res.status(500).json({ message: "Logout error", error });
  }
};

// export const getCurrentUser = async (req, res) => {
//   try {
//     const token = req.cookies.token;
//     if (!token) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     const decoded = jwt.verify(token, JWT_SECRET);
//     const user = await User.findById(decoded.id).select("-password");

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     return res.status(200).json(user);
//   } catch (error) {
//     console.error("Error fetching current user:", error);
//     return res.status(500).json({ message: "Internal server error", error });
//   }
// }

export const getCurrentUser = async (req, res) => {
  try {
    // req.user is already set by authMiddleware
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching current user:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const uploadAvatar = async (req, res) => {
  try {
    const userId = req.user.id; // assuming auth middleware sets this
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // console.log("REQ FILE:", req.file);
    // console.log("REQ BODY:", req.body);

    // Delete old avatar if exists
    if (user.profileImage?.public_id) {
      await cloudinary.uploader.destroy(user.profileImage.public_id);
    }

    // Save new avatar
    user.profileImage = {
      url: req.file.path,
      public_id: req.file.filename,
    };

    await user.save();
    res.status(200).json({
      message: "Profile picture updated",
      profileImage: user.profileImage,
    });
  } catch (err) {
    console.error("Avatar upload failed:", err);
    res.status(500).json({ message: "Server error during upload" });
  }
};
