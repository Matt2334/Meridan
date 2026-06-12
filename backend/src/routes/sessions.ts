// const express = require('express');
// const authJWT = require('../middleware/auth');
// const router = express.Router();
// const {createSession, getPastSessions, getSession, sessionComplete, sessionItemRead, getSessionConnections} = require('../controllers/sessionController');
import express from "express";
import authJWT from "../middleware/auth";
import {createSession, getPastSessions, getSession, sessionComplete, sessionItemRead, getSessionConnections} from '../controllers/sessionController';

const sessionRouter = express.Router();

sessionRouter.get('/sessions', authJWT, getPastSessions);
sessionRouter.get('/session/connections', authJWT, getSessionConnections);
sessionRouter.get('/session/:id', authJWT, getSession);
sessionRouter.post('/sessions', authJWT, createSession);
sessionRouter.patch('/sessions/:id/complete', authJWT, sessionComplete);
sessionRouter.patch('/sessions/:sessionId/items/:itemId/read', authJWT, sessionItemRead);

export {sessionRouter};
