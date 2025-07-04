import express from 'express';
import { signup, login, logout, getCurrentUser, updateProfile } from '../controllers/authController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import upload from "../middlewares/upload.js";
import { uploadAvatar } from "../controllers/authController.js";

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout); 
router.get('/me', authMiddleware, getCurrentUser); 

router.put('/update-profile', authMiddleware, updateProfile);
router.post("/upload-avatar", authMiddleware, upload.single("avatar"), uploadAvatar);

export default router;