import Link from "../models/link.js";
import User from "../models/user.js";
import { fetchOgImage } from "../utils/fetchOgImage.js";

export const getPublicFeedLinks = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const publicLinks = await Link.find({ isPublic: true })
      .populate("userId", "name email username")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const totalCount = await Link.countDocuments({ isPublic: true });

    return res.status(200).json({
      message: "Public feed links fetched successfully",
      links: publicLinks,
      total: totalCount,
      page: Number(page),
      hasMore: page * limit < totalCount,
    });
  } catch (error) {
    console.error("Error fetching public feed links:", error);
    return res.status(500).json({
      message: "Error fetching public feed links",
      error: error.message || error,
    });
  }
};

export const createPublicLink = async (req, res) => {
  // Ensure the user is authenticated
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { title, tags, isNSFW } = req.body;
  let url = req.body.url.trim();
  const userId = req.user.id; // user ID is stored in req.user after authentication
  const previewImage = await fetchOgImage(url);

  try {
    // Validate inputs
    if (
      !url ||
      !title ||
      typeof url !== "string" ||
      typeof title !== "string"
    ) {
      return res.status(400).json({ message: "URL and title are required" });
    }

    if (!/^(https?:\/\/)?([\w-]+\.)+[a-zA-Z]{2,}(\/\S*)?$/.test(url)) {
      return res.status(400).json({
        message:
          "Please enter a valid URL with a domain like example.com or dev.to",
      });
    }

    if (!/^https?:\/\//.test(url)) {
      url = "https://" + url;
    }

    //Array.isArray -> agar already ek array hai to let it be (tagsArray = tags)
    const tagsArray = Array.isArray(tags)
      ? tags
      : // Agar string hai to split by comma and trim spaces
      typeof tags === "string"
      ? tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
      : [];
    // Agar kuch aur hai to empty array

    const newLink = await Link.create({
      url,
      title,
      tags: tagsArray,
      isPublic: true, // Public links are always public
      isNSFW: isNSFW || false,
      userId,
      previewImage: previewImage || null, // Store the fetched preview image
    });

    await newLink.populate("userId", "name email");

    return res.status(201).json({
      message: "Link created successfully",
      link: {
        _id: newLink._id,
        url: newLink.url,
        title: newLink.title,
        tags: newLink.tags,
        isPublic: newLink.isPublic,
        isNSFW: newLink.isNSFW,
        previewImage: newLink.previewImage, // Include the preview image in the response
        createdAt: newLink.createdAt,
        userId: newLink.userId,
      },
    });
  } catch (err) {
    console.error("Error creating link:", err);

    return res.status(500).json({
      message: "Error creating link",
      error: err.message || err,
    });
  }
};

export const toggleLikeLink = async (req, res) => {
  const userId = req.user.id;
  const { id: linkId } = req.params;

  try {
    if (!linkId) {
      return res.status(400).json({ message: "Link ID is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    // Find the link by ID
    const link = await Link.findById(linkId);
    if (!link) {
      return res.status(404).json({ error: "Link not found." });
    }

    const alreadyLiked =
      link.likes.includes(userId) && user.likedLinks.includes(linkId);

    if (alreadyLiked) {
      link.likes.pull(userId);
      user.likedLinks.pull(linkId);
    } else {
      link.likes.push(userId);
      user.likedLinks.push(linkId);
    }

    await link.save();
    await user.save();

    return res.status(200).json({ success: true, liked: !alreadyLiked });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error Liking link",
      error: error.message || error,
    });
  }
};

export const toggleSaveLink = async (req, res) => {
  const userId = req.user.id;
  const { id: linkId } = req.params;

  try {
    if (!linkId) {
      return res.status(400).json({ message: "Link ID is required" });
    }

    //user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Find the link by ID
    const link = await Link.findById(linkId);
    if (!link) {
      return res.status(404).json({ error: "Link not found." });
    }

    const alreadySaved =
      link.saves.includes(userId) && user.savedLinks.includes(linkId);

    if (alreadySaved) {
      link.saves.pull(userId);
      user.savedLinks.pull(linkId);
    } else {
      link.saves.push(userId);
      user.savedLinks.push(linkId);
    }

    const savedCopy = new Link({
      userId: req.user.id,
      title: link.title,
      url: link.url,
      tags: link.tags,
      isPrivate: true,
      isNSFW: link.isNSFW,
      previewImage: link.previewImage,
      sourceId: link._id,
    });

    await savedCopy.save();
    await link.save();
    await user.save();

    return res.status(200).json({ success: true, saved: !alreadySaved });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error Liking link",
      error: error.message || error,
    });
  }
};

export const searchLinks = async (req, res) => {
  const { q, tag } = req.query;
  if ((!q || q.trim() === "") && (!tag || tag.trim() === "")) {
    return res.status(400).json({ message: "Search query is required." });
  }

  const query = { isPublic: true };
  const orConditions = [];

  if (q && q.trim()) {
    const regex = new RegExp(q.trim(), "i");
    orConditions.push(
      { title: regex },
      { url: regex },
      { tags: { $in: [regex] } }
    );
  }

  if (tag && tag.trim()) {
    const tagRegex = new RegExp(tag.trim(), "i");
    orConditions.push({ tags: { $in: [tagRegex] } });
  }

  if (orConditions.length > 0) {
    query.$or = orConditions;
  }
  try {
    const links = await Link.find(query).limit(20);
    res.status(200).json(links);
  } catch (err) {
    console.error("Search failed:", err);
    res.status(500).json({ message: "Search failed", error: err.message });
  }
};

