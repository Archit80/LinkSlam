import express from "express";
import { createPublicLink, getPublicFeedLinks, toggleLikeLink, toggleSaveLink } from "../controllers/publicLinkController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/feed", getPublicFeedLinks);
router.post("/create", authMiddleware, createPublicLink);
router.post('/like/:id', authMiddleware, toggleLikeLink);
router.post('/save/:id', authMiddleware, toggleSaveLink);


export default router;