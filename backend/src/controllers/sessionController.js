const { Prisma } = require("../../prisma/library/prisma");
const { generateSession } = require("../services/sessionService");

// router.get('/sessions', authJWT, getPastSessions);
const getPastSessions = async (req, res) => {
  const userId = req.user?.userId;
  const { limit = 5, offset = 0 } = req.query;
  try {
    const user = await Prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: "User not found" });
    const sessions = await Prisma.session.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: parseInt(limit),
      skip: parseInt(offset),
    });
    res.json({
      sessions,
      total: await Prisma.session.count({ where: { userId } }),
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

// router.post('/sessions', authJWT, generateSession);
const createSession = async (req, res) => {
  const userId = req.user?.userId;
  const { time, topic, formats } = req.body;
  try {
    if (!time || !topic) {
      return res.status(400).json({ error: "time and topic are required" });
    }
    const user = await Prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const session = await generateSession({
      userId,
      time: Number(time),
      topic: topic.toUpperCase(),
      formats,
    });
    return res.json(session);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// router.get('/sessions/:id', authJWT, getSession);
const getSession = async (req, res) => {
  const userId = req.user?.userId;
  const { id } = req.params;
  try {
    const session = await Prisma.session.findUnique({
      where: { id: parseInt(id) },
    });
    if (!session) return res.status(404).json({ error: "Session not found" });
    if (session.userId !== userId)
      return res.status(403).json({ error: "Unauthorized" });
    res.json(session);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

// router.patch('/sessions/:id/complete', authJWT, sessionComplete);
const sessionComplete = async (req, res) => {
  const userId = req.user?.userId;  
  const { id } = req.params;
  try {
    const session = await Prisma.session.findUnique({
      where: { id: parseInt(id) },
    });
    if (!session) return res.status(404).json({ error: "Session not found" });
    if (session.userId !== userId)
      return res.status(403).json({ error: "Unauthorized" });
    const updatedSession = await Prisma.session.update({
      where: { id: parseInt(id) },
      data: { completed: true },
    });
    res.json(updatedSession);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

// '/sessions/:sessionId/items/:itemId/read'
const sessionItemRead = async (req, res) => {
  const userId = req.user?.userId;
  const { sessionId, itemId } = req.params;
  try {
    const session = await Prisma.session.findUnique({
      where: { id: sessionId },
    });
    if (!session) return res.status(404).json({ error: "Session not found" });
    if (session.userId !== userId)
      return res.status(403).json({ error: "Unauthorized" });
    const sessionItem = await Prisma.sessionItem.findUnique({
      where: { id: itemId },
    });
    if (!sessionItem)
      return res.status(404).json({ error: "Session item not found" });
    const updatedSessionItem = await Prisma.sessionItem.update({
      where: { id: itemId },
      data: { completed: true },
    });
    res.json(updatedSessionItem);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};
module.exports = {
  createSession,
  getPastSessions,
  getSession,
  sessionComplete,
  sessionItemRead,
};
