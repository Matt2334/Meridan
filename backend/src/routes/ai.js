const express = require('express');
const router = express.Router();
const authJWT = require('../middleware/auth');
const { generateTakeaways } = require('../controllers/aiController');

router.post('/sessions/:sessionId/takeaways', authJWT, generateTakeaways)
module.exports = router;