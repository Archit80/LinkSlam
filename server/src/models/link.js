import mongoose from "mongoose";

const linkSchema = new mongoose.Schema(
    {
        url: { type: String, required: true },
        title: { type: String, required: true },
        tags: [{ type: String }],
        isPublic: { type: Boolean, default: false },
        isNSFW: { type: Boolean, default: false },
        previewImage: { type: String },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
    },
    { timestamps: true }
)

const Link = mongoose.model("Link", linkSchema);
export default Link;
