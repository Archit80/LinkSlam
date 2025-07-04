import express from "express";
import { createPublicLink, searchLinks, getPublicFeedLinks, toggleLikeLink, toggleSaveLink } from "../controllers/publicLinkController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/feed", getPublicFeedLinks);
router.post("/create", authMiddleware, createPublicLink);
router.post('/like/:id', authMiddleware, toggleLikeLink);
router.post('/save/:id', authMiddleware, toggleSaveLink);
router.get("/search", authMiddleware, searchLinks);


export default router;