import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    isNewUser: { type: Boolean, default: true },
    username: { type: String, unique: true, sparse: true },
    email: { type: String, required: true, unique: true },
    bio: { type: String, default: "" },
    password: { type: String, required: false }, // allow empty password for OAuth users
    name: String,
    googleId: String, // optionally store Google ID for OAuth users
    likedLinks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Link" }],
    savedLinks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Link" }],
    profileImage: {
      url: { type: String, default: "" }, // actual image URL from Cloudinary
      public_id: { type: String, default: "" }, // Cloudinary's internal ID
    },
  },

  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
