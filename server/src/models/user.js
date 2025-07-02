import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false }, // allow empty password for OAuth users
    name: String,
    googleId: String, // optionally store Google ID for OAuth users
    likedLinks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Link" }],
    savedLinks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Link" }],
  },

  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;