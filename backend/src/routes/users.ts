import express from "express";
import authJWT from "../middleware/auth";
import {authLimiter} from '../middleware/rateLimiters';
const router = express.Router();

import {signUp, signIn, deleteUser, signOut, userInfo, updateUser, loggedIn } from '../controllers/usersController';

router.post('/signup', authLimiter, signUp);
router.post('/signIn', authLimiter, signIn);
router.delete('/delete', authJWT, deleteUser);
router.post('/signout', authJWT, signOut);
router.get('/me', authJWT, userInfo);
router.get('/loggedIn', loggedIn);
router.patch('/update', authJWT, updateUser);


module.exports = router;
