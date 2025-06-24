import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false }, // allow empty password for OAuth users
    name: String,
    googleId: String, // optionally store Google ID for OAuth users

  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;