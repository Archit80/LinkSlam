import express from "express";
import { getUserProfile, searchUsers } from "../controllers/userController.js";

const router = express.Router();

router.get("/profile/:id", getUserProfile);
router.get("/search", searchUsers); 

export default router;
