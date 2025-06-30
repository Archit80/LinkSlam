import express from 'express';
// import { Router } from 'express';
import { signup, login, logout, getCurrentUser } from '../controllers/authController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
// import {authMiddleware} from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout); 
router.get('/me', authMiddleware, getCurrentUser); 

export default router;