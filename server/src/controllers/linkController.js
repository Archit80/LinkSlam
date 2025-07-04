import Link from "../models/link.js";
import mongoose from "mongoose"; 
import { fetchOgImage } from "../utils/fetchOgImage.js";

export const createLink = async (req, res) => {
  // Ensure the user is authenticated
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { title, tags, isPublic, isNSFW } = req.body;
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
      isPublic: isPublic || false,
      isNSFW: isNSFW || false,
      userId,
      previewImage: previewImage || null, // Store the fetched preview image
    });

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

export const getAllLinks = async (req, res) => {
  try {
    const Links = await Link.find({ userId: req.user.id }).sort({createdAt: -1});
    return res.status(200).json({
      message: "Links fetched successfully",
      links: Links,
    });
  } catch (err) {
    console.error("Error fetching links:", err);
    return res.status(500).json({
      message: "Error fetching links",
      error: err.message || err,
    });
  }
};

export const getPrivateLinks = async (req, res) => {
  try {
    const privateLinks = await Link.find({
      userId: req.user.id,
      isPublic: false,
    }).sort({createdAt: -1});
    return res.status(200).json({
      message: "Private links fetched successfully",
      links: privateLinks,
    });
  } catch (err) {
    console.error("Error fetching private links:", err);
    return res.status(500).json({
      message: "Error fetching private links",
      error: err.message || err,
    });
  }
};

export const getPublicLinks = async (req, res) => {
  try {
    const publicLinks = await Link.find({
      userId: req.user.id,
      isPublic: true,
    }).sort({createdAt: -1});
    return res.status(200).json({
      message: "Public links fetched successfully",
      links: publicLinks,
    });
  } catch (err) {
    console.error("Error fetching public links:", err);
    return res.status(500).json({
      message: "Error fetching public links",
      error: err.message || err,
    });
  }
};

export const deleteLink = async (req, res) => {
  const { linkId } = req.params; //destructuring linkId from req.params
  try {
    // Validate linkId
    if (!linkId) {
      return res.status(400).json({ message: "Link ID is required" });
    }

    // Find the link by ID and ensure it belongs to the authenticated user
    const link = await Link.findOne({ _id: linkId, userId: req.user.id });

    if (!link) {
      return res
        .status(404)
        .json({ message: "Link not found or unauthorized" });
    }

    // Delete the link
    await Link.deleteOne({ _id: linkId });

    return res.status(200).json({
      message: "Link deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting link:", error);
    return res.status(500).json({
      message: "Error deleting link",
      error: error.message || error,
    });
  }
};

export const updateLink = async (req, res) => {
  const { linkId } = req.params; // Get linkId from request parameters
  const { url, title, tags, isPublic, isNSFW } = req.body; // Get updated link data from request body
  const previewImage = await fetchOgImage(url);

  try {
    if (!linkId) {
      return res.status(400).json({ message: "Link ID is required" });
    }
    // Validate that the link exists and belongs to the authenticated user
    const link = await Link.findOne({ _id: linkId, userId: req.user.id });
    if (!link) {
      return res
        .status(404)
        .json({ message: "Link not found or unauthorized" });
    }

    // Update the link with new data
    link.url = url || link.url;
    link.title = title || link.title;
    link.tags =
      (Array.isArray(tags)
        ? tags
        : // Agar string hai to split by comma and trim spaces
        typeof tags === "string"
        ? tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
        : []) || link.tags;
    link.isPublic = isPublic !== undefined ? isPublic : link.isPublic;
    link.isNSFW = isNSFW !== undefined ? isNSFW : link.isNSFW;

    if (!/^https?:\/\//.test(link.url)) {
      link.url = "https://" + link.url;
    }
    link.previewImage = previewImage || link.previewImage; // Update the preview image if provided

    await link.save(); // Save the updated link

    return res.status(200).json({
      message: "Link updated successfully",
      link: {
        _id: link._id,
        url: link.url,
        title: link.title,
        tags: link.tags,
        isPublic: link.isPublic,
        isNSFW: link.isNSFW,
        previewImage: link.previewImage, // Include the preview image in the response
        createdAt: link.createdAt,
        userId: link.userId,
      },
    });
  } catch (error) {
    console.error("Error updating link:", error);
    return res.status(500).json({
      message: "Error updating link",
      error: error.message || error,
    });
  }
};

export const searchLinks = async (req, res) => {
  const { q, tag } = req.query;

  if ((!q || q.trim() === "") && (!tag || tag.trim() === "")) {
    return res
      .status(400)
      .json({ message: "Search query or tag is required." });
  }

  const query = {
    userId: req.user.id, // Only links created by the current user
    isDeleted: { $ne: true }, // Exclude deleted links
  };

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

export const getTopTags = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const result = await Link.aggregate([
      { $match: { userId: userId, tags: { $exists: true, $ne: [] } } },
      { $unwind: "$tags" },
      { $group: { _id: "$tags", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $project: { _id: 0, tag: "$_id", count: 1 } },
    ]);

    const tags = result.map((r) => r.tag);

    res.status(200).json({ tags });
  } catch (err) {
    console.error("Error fetching top tags:", err);
    res.status(500).json({ message: "Failed to fetch top tags." });
  }
};
