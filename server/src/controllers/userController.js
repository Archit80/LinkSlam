import User from "../models/user.js";
import Link from "../models/link.js";

export const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch user basic info
    const user = await User.findById(id).select("_id name email createdAt profileImage username bio");
    if (!user) return res.status(404).json({ message: "User not found" });

    // Fetch public links by this user
    const publicLinks = await Link.find({
      userId: id,
      isPublic: true,
      isDeleted: { $ne: true },
    })
      .sort({ createdAt: -1 })
      .lean();


    // Count for stats (feel free to optimize later)
    const totalLinks = await Link.countDocuments({ userId: id });
    const totalSlams = publicLinks.length;
    const totalSaved = (await Link.countDocuments({ saves: id })) || 0;

    return res.status(200).json({
      user,
      publicLinks,
      stats: {
        totalLinks,
        slams: totalSlams,
        saved: totalSaved,
      },
    });
  } catch (err) {
    console.error("getUserProfile error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const searchUsers = async (req, res) => {
  const { q } = req.query;

  if (!q || q.trim() === "") {
    return res.status(400).json({ message: "Search query is required." });
  }

  const regex = new RegExp(q.trim(), "i"); // case-insensitive partial match

  try {
    const users = await User.find({
      $or: [
        { username: regex },
        { name: regex }
      ]
    })
    .select("username name profileImage") // only return needed fields
    .limit(20);

    res.status(200).json(users);
  } catch (err) {
    console.error("User search failed:", err);
    res.status(500).json({ message: "User search failed", error: err.message });
  }
};
