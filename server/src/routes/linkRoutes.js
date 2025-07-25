// import Link from "../models/link";
import { createLink, deleteLink, getAllLinks, getTopTags, getPrivateLinks, searchLinks, getPublicLinks, updateLink } from "../controllers/linkController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import express from "express";
const router = express.Router();

router.post("/create", authMiddleware, createLink);
router.get("/get-all", authMiddleware, getAllLinks);
router.get("/get-private", authMiddleware, getPrivateLinks);
router.get("/get-public", authMiddleware, getPublicLinks);
router.delete("/delete/:linkId", authMiddleware, deleteLink);
router.put("/update/:linkId", authMiddleware, updateLink);  
router.get("/search", authMiddleware, searchLinks);

router.get("/top-tags", authMiddleware, getTopTags);

export default router;

