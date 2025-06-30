import express from "express";
import { getPublicFeedLinks } from "../controllers/publicLinkController";


const router = express.Router();

router.get("/", getPublicFeedLinks);

export default router;