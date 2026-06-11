import express from "express";
const router = express.Router();
import authJWT from '../middleware/auth';
import { generateTakeaways } from '../controllers/aiController';

router.post('/sessions/:sessionId/takeaways', authJWT, generateTakeaways)
module.exports = router;