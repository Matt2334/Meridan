// require('dotenv').config({ path: `../.env.local` });
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const db = require('./db');

const usersRouter = require('./routes/users');
const contentRouter = require('./routes/content');
const sessionRouter = require('./routes/sessions');

const app = express();

app.use(cors({
  origin: process.env.ORIGIN,
  credentials: true,
}));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(express.json());

app.get('/health', async (req, res) => {
  try {
    await db.query('SELECT 1');
    res.json({ status: 'ok' });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

app.use('/users', usersRouter);
app.use('/', contentRouter);
app.use('/', sessionRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
