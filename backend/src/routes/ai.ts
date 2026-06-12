import express from "express";
import authJWT from '../middleware/auth';
import { generateTakeaways } from '../controllers/aiController';

const aiRouter = express.Router();

aiRouter.post('/sessions/:sessionId/takeaways', authJWT, generateTakeaways);
export { aiRouter };
