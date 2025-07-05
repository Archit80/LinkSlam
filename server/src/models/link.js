import mongoose from "mongoose";

const linkSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    title: { type: String, required: true },
    tags: [{ type: String }],
    isPublic: { type: Boolean, default: false },
    isNSFW: { type: Boolean, default: false },
    previewImage: { type: String },
    sourceId : {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Link",
      default: null, // This will be null for original links
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    saves: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

  },
  { timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
 }
);

const Link = mongoose.models.Link || mongoose.model("Link", linkSchema);
export default Link;
