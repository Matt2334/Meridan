// require('dotenv').config({ path: `../.env.local` });
require('dotenv').config();

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import db from './db';

import {userRouter} from './routes/users';
import {contentRouter} from './routes/content';
import {sessionRouter} from './routes/sessions';
import {bookmarkRouter} from './routes/bookmark';
import {aiRouter} from './routes/ai';
import { generalLimiter } from './middleware/rateLimiters';
const app = express();

app.use(cors({
  origin: process.env.ORIGIN,
  credentials: true,
}));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(express.json());
app.use(generalLimiter);

app.get('/health', async (req, res) => {
  try {
    await db.query('SELECT 1');
    res.json({ status: 'ok' });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

app.use('/users', userRouter);
app.use('/', contentRouter);
app.use('/', sessionRouter);
app.use('/', bookmarkRouter);
app.use('/', aiRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
