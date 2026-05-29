const express = require('express');
const authJWT = require('../middleware/auth');
const router = express.Router();
const {createSession, getPastSessions, getSession, sessionComplete, sessionItemRead} = require('../controllers/sessionController');


router.get('/sessions', authJWT, getPastSessions);
router.post('/sessions', authJWT, createSession);
router.get('/sessions/:id', authJWT, getSession);
router.patch('/sessions/:id/complete', authJWT, sessionComplete);
router.patch('/sessions/:sessionId/items/:itemId/read', authJWT, sessionItemRead);

module.exports = router;
