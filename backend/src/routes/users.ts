import express from "express";
import authJWT from "../middleware/auth";
import {authLimiter} from '../middleware/rateLimiters';
import {signUp, signIn, deleteUser, signOut, userInfo, updateUser, loggedIn } from '../controllers/usersController';
const userRouter = express.Router();

userRouter.post('/signup', authLimiter, signUp);
userRouter.post('/signIn', authLimiter, signIn);
userRouter.delete('/delete', authJWT, deleteUser);
userRouter.post('/signout', authJWT, signOut);
userRouter.get('/me', authJWT, userInfo);
userRouter.get('/loggedIn', loggedIn);
userRouter.patch('/update', authJWT, updateUser);


export{userRouter};
