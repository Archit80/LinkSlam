import Link from '../models/link.js';

export const getPublicFeedLinks = async (req, res) => {
    try {
        const publicLinks = await Link.find({ isPublic: true })
            .populate('userId', 'name email') // Populate user details
            .sort({ createdAt: -1 }) // Sort by creation date, most recent first
            .limit(30); // Limit to 20 links

        return res.status(200).json({
            message: "Public feed links fetched successfully",
            links: publicLinks
        });
        
    } catch (error) {
        console.error("Error fetching public feed links:", error);
        return res.status(500).json({
            message: "Error fetching public feed links",
            error: error.message || error
        });
    }
}