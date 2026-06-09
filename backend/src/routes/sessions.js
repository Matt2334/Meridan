const express = require('express');
const authJWT = require('../middleware/auth');
const router = express.Router();
const {createSession, getPastSessions, getSession, sessionComplete, sessionItemRead, getSessionConnections} = require('../controllers/sessionController');


router.get('/sessions', authJWT, getPastSessions);
router.get('/session/connections', authJWT, getSessionConnections);
router.get('/session/:id', authJWT, getSession);
router.post('/sessions', authJWT, createSession);
router.patch('/sessions/:id/complete', authJWT, sessionComplete);
router.patch('/sessions/:sessionId/items/:itemId/read', authJWT, sessionItemRead);

module.exports = router;
