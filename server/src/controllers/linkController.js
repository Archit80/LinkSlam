import Link from '../models/link.js';
// import authMiddleware from '../middleware/authMiddleware.js';

export const createLink = async (req, res) =>{
    // Ensure the user is authenticated
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    
    const { title, tags, isPublic, isNSFW } = req.body;
    let url = req.body.url.trim();
    const userId = req.user.id; // user ID is stored in req.user after authentication

    try {
        // Validate inputs
        if(!url || !title || typeof url !== 'string' || typeof title !== 'string') {
            return res.status(400).json({ message: "URL and title are required" });
        }
        
        if (!/^(https?:\/\/)?([\w-]+\.)+[a-zA-Z]{2,}(\/\S*)?$/.test(url)) {
            return res.status(400).json({
                message: "Please enter a valid URL with a domain like example.com or dev.to",
            });
        }

        if (!/^https?:\/\//.test(url)) {
            url = 'https://' + url;
        }
        
        //Array.isArray -> agar already ek array hai to let it be (tagsArray = tags)
        const tagsArray =
        Array.isArray(tags) ? tags : ( 
            // Agar string hai to split by comma and trim spaces
            typeof tags === "string"
            ? tags.split(',').map(tag => tag.trim()).filter(Boolean)
            : []);
            // Agar kuch aur hai to empty array

        const newLink = await Link.create({
            url,
            title,
            tags: tagsArray,
            isPublic: isPublic || false,
            isNSFW: isNSFW || false,
            userId
        })

        return res.status(201).json({
            message: "Link created successfully",
            link: {
                id: newLink._id,
                url: newLink.url,
                title: newLink.title,
                tags: newLink.tags,
                isPublic: newLink.isPublic,
                isNSFW: newLink.isNSFW,
                createdAt: newLink.createdAt,
                userId: newLink.userId
            }
        });

    } catch (err) {
        console.error("Error creating link:", err);
   
        return res.status(500).json({
        message: "Error creating link",
        error: err.message || err
        });

    }
}



export const getAllLinks = async (req, res) => {
    try{
        const Links = await Link.find({ userId: req.user.id });
        return res.status(200).json({
            message: "Links fetched successfully",
            links: Links
        });

    }
    catch(err){
        console.error("Error fetching links:", err);
        return res.status(500).json({
            message: "Error fetching links",
            error: err.message || err
        });
        
    }
}

export const getPrivateLinks = async (req,res) =>{
    try {
        const privateLinks = await Link.find({ userId: req.user.id, isPublic: false });
        return res.status(200).json({
            message: "Private links fetched successfully",
            links: privateLinks
        });
    } catch (err) {
        console.error("Error fetching private links:", err);
        return res.status(500).json({
            message: "Error fetching private links",
            error: err.message || err
        });
    }
}

export const getPublicLinks = async (req, res) => {
    try {
        const publicLinks = await Link.find({ isPublic: true });
        return res.status(200).json({
            message: "Public links fetched successfully",
            links: publicLinks
        });
    } catch (err) {
        console.error("Error fetching public links:", err);
        return res.status(500).json({
            message: "Error fetching public links",
            error: err.message || err
        });
    }
}

export const deleteLink = async (req, res) => {
    const {linkId} = req.params; //destructuring linkId from req.params
    try {
        // Validate linkId
        if (!linkId) {
            return res.status(400).json({ message: "Link ID is required" });
        }

        // Find the link by ID and ensure it belongs to the authenticated user
        const link = await Link.findOne({ _id: linkId, userId: req.user.id });
        
        if (!link) {
            return res.status(404).json({ message: "Link not found or unauthorized" });
        }

        // Delete the link
        await Link.deleteOne({ _id: linkId });

        return res.status(200).json({
            message: "Link deleted successfully"
        });

    } catch (error) {
        console.error("Error deleting link:", error);
        return res.status(500).json({
            message: "Error deleting link",
            error: error.message || error
        });
        
    }
}

export const updateLink = async (req, res) => {
    const {linkId} = req.params; // Get linkId from request parameters
    const { url, title, tags, isPublic, isNSFW } = req.body; // Get updated link data from request body

    try {
        if(!linkId) {
            return res.status(400).json({ message: "Link ID is required" });
        }
        // Validate that the link exists and belongs to the authenticated user
        const link = await Link.findOne({ _id: linkId, userId: req.user.id });
        if (!link) {
            return res.status(404).json({ message: "Link not found or unauthorized" });
        }
        
        // Update the link with new data
        link.url = url || link.url;
        link.title = title || link.title;
        link.tags =(Array.isArray(tags) ? tags : ( 
            // Agar string hai to split by comma and trim spaces
            typeof tags === "string"
            ? tags.split(',').map(tag => tag.trim()).filter(Boolean)
            : []) ) || link.tags;
            link.isPublic = isPublic !== undefined ? isPublic : link.isPublic;
            link.isNSFW = isNSFW !== undefined ? isNSFW : link.isNSFW;
            
            if (!/^https?:\/\//.test(link.url)) {
                link.url = 'https://' + link.url;
            }
            
        await link.save(); // Save the updated link

        return res.status(200).json({
            message: "Link updated successfully",
            link: {
                id: link._id,
                url: link.url,
                title: link.title,
                tags: link.tags,
                isPublic: link.isPublic,
                isNSFW: link.isNSFW,
                createdAt: link.createdAt,
                userId: link.userId
            }
        });

    } catch (error) {
        console.error("Error updating link:", error);
        return res.status(500).json({
            message: "Error updating link",
            error: error.message || error
        });
    }

}