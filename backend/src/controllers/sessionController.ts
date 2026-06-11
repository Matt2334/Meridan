import { Prisma } from "../../prisma/library/prisma";
import { Request, Response } from "express";
import { generateSession } from "../services/sessionService";
import { crossConnections } from "./aiController";
import {
  GetSessionsQuery,
  GetSessionsResponse,
  CreateSessionRequest,
  GetSessionByParams,
  SessionItemCompleteParams,
  SessionItemResponse,
  ErrorResponse
} from "../types";

// Request<Params, ResBody, ReqBody, QueryParams>

// router.get('/sessions', authJWT, getPastSessions);
interface PastSessions {
  sessions: GetSessionsResponse[];
  total: number;
}
const getPastSessions = async (
  req: Request<{}, {}, {}, GetSessionsQuery>,
  res: Response<PastSessions | ErrorResponse>,
): Promise<void> => {
  const userId = req.user?.userId as string;
  const { limit = "5", offset = "0" } = req.query;
  try {
    const user = await Prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    const [sessions, total] = await Prisma.$transaction([
      Prisma.session.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: parseInt(limit),
      skip: parseInt(offset),
    }),
    Prisma.session.count({ where: { userId } })
  ]);
    res.json({
      sessions,
      total,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: (err as Error).message });
  }
};

// router.post('/sessions', authJWT, generateSession);
const createSession = async (req:Request<{}, {}, CreateSessionRequest>, res:Response<GetSessionsResponse| ErrorResponse>):Promise<void> => {
  const userId = req.user?.userId;
  const { time, topic, formats } = req.body;
  const idempotencyKey = req.headers["idempotency-key"];
  try {
    // check for existing session with same idempotency key to prevent duplicates on retry
    if (idempotencyKey) {
      const existing = await Prisma.session.findUnique({
        where: { idempotencyKey },
        include: {
          sessionItems: {
            include: { content: true },
          },
        },
      });
      if (existing) {res.status(201).json(existing); // return existing session
        return;}
    }

    if (!time || !topic) {
       {res.status(400).json({ error: "time and topic are required" });return;}
    }
    const user = await Prisma.user.findUnique({ where: { id: userId } });
    if (!user)  {res.status(404).json({ error: "User not found" });return;}

    const session = await generateSession({
      userId,
      time: Number(time),
      topic: topic.toUpperCase(),
      formats,
      idempotencyKey,
    });
    res.status(201).json(session);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: (err as Error).message });
  }
};

// router.get('/sessions/:id', authJWT, getSession);
const getSession = async (req:Request<GetSessionByParams>, res:Response<GetSessionsResponse | ErrorResponse>): Promise<void> => {
  const userId = req.user?.userId;
  const { id } = req.params;
  try {
    const session = await Prisma.session.findUnique({
      where: { id: id },
    });
    if (!session)  {res.status(404).json({ error: "Session not found" });return;}
    if (session.userId !== userId)
       {res.status(403).json({ error: "Unauthorized" });return;}
    res.json(session);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: (err as Error).message });
  }
};

// router.patch('/sessions/:id/complete', authJWT, sessionComplete);
const sessionComplete = async (req:Request<GetSessionByParams>, res:Response<GetSessionsResponse|ErrorResponse>):Promise<void> => {
  const userId = req.user?.userId;
  const { id } = req.params;
  try {
    const session = await Prisma.session.findUnique({
      where: { id: id },
    });
    if (!session)  {res.status(404).json({ error: "Session not found" });return;}
    if (session.userId !== userId)
     {res.status(403).json({ error: "Unauthorized" });return;}
    const updatedSession = await Prisma.session.update({
      where: { id: id },
      data: { completedAt: new Date() },
    });
    await crossConnections({ id, userId });
    res.json(updatedSession);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// '/sessions/:sessionId/items/:itemId/read'
const sessionItemRead = async (req:Request<SessionItemCompleteParams>, res:Response<SessionItemResponse|ErrorResponse>):Promise<void> => {
  const userId = req.user?.userId;
  const { sessionId, itemId } = req.params;
  try {
    const session = await Prisma.session.findUnique({
      where: { id: sessionId },
    });
    if (!session)  {res.status(404).json({ error: "Session not found" });return;}
    if (session.userId !== userId)
      { res.status(403).json({ error: "Unauthorized" });return;}
    const sessionItem = await Prisma.sessionItem.findUnique({
      where: { id: itemId },
    });
    if (!sessionItem)
       {res.status(404).json({ error: "Session item not found" });return;}
    const updatedSessionItem = await Prisma.sessionItem.update({
      where: { id: itemId },
      data: { completed: true },
    });
    res.json(updatedSessionItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};


interface SessionsConnect{
  id?:number;
  topic?:string;
  timeAvailable?:number;
  createdAt?:Date
}
interface Connection{
  id?:string;
  fromSessionId?: string;
  toSessionId?:   string;
  strength?:number;   
  reason?:string;
}

interface SessionConnectionResponse{
  connections: Connection[];
  sessions: SessionsConnect[];
}
const getSessionConnections = async (req:Request, res:Response<SessionConnectionResponse|ErrorResponse>) => {
  const userId = req.user?.userId;
  try {
    const user = await Prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: "User not found" });
    const sessions = await Prisma.session.findMany({
      where: { userId, completedAt: { not: null } },
      select: { id: true, topic: true, timeAvailable: true, createdAt: true },
    });
    if (sessions.length === 0)
      return res.json({ connections: [], sessions: [] });

    const sessionIds = sessions.map((s) => s.id);
    const connections = await Prisma.sessionConnection.findMany({
      where: {
        OR: [
          { fromSessionId: { in: sessionIds } },
          { toSessionId: { in: sessionIds } },
        ],
      },
    });
    res.json({ connections, sessions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export{
  createSession,
  getPastSessions,
  getSession,
  sessionComplete,
  sessionItemRead,
  getSessionConnections,
};
