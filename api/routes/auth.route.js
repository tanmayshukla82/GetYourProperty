import express from 'express';
import { googleAuth, signOut, signin, signup } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/signup',signup);
router.post('/signin',signin);
router.post('/googleAuth',googleAuth);
router.get('/signOut',signOut);
export default router;