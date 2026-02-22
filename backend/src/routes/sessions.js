const express = require('express');
const authJWT = require('../middleware/auth');
const router = express.Router();
const {createSession, getPastSessions, getSession, sessionComplete} = require('../controllers/contentController');

router.get('/session/:user_id', authJWT, getPastSessions);
router.post('/sessions', authJWT, createSession);
router.get('/sessions/:id', authJWT, getSession);
router.put('/sessions/:id/complete', authJWT, sessionComplete);

module.exports = router;