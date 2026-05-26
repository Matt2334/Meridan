const { Prisma } = require("../../prisma/library/prisma");
const { generateSession } = require("../services/sessionService");

// router.get('/session/:user_id', authJWT, getPastSessions);
const getPastSessions = async (req, res) => {
  const userId = req.user?.userId;
  const { uid } = req.params;
  try {
    if (parseInt(uid) !== userId)
      return res.status(403).json({ error: "Unauthorized" });
    const user = await Prisma.user.findUnique({ where: { id: userId } });

    if (!user) return res.status(404).json({ error: "User not found" });
    const sessions = await Prisma.sessions.findMany({ where: { userId } });

    if (!sessions.length)
      return res.status(404).json({ error: "No sessions found for this user" });
    res.json(sessions);
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
      return res
        .status(400)
        .json({ error: "time and topic are required" });
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
    const session = await Prisma.sessions.findUnique({
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

// router.put('/sessions/:id/complete', authJWT, sessionComplete);
const sessionComplete = async (req, res) => {
   const userId = req.user?.userId;
  const { id } = req.params;
  try {
    const session = await Prisma.sessions.findUnique({
      where: { id: parseInt(id) },
    });
    if (!session) return res.status(404).json({ error: "Session not found" });
    if (session.userId !== userId)
      return res.status(403).json({ error: "Unauthorized" });
    const updatedSession = await Prisma.sessions.update({
      where: { id: parseInt(id) },
      data: { completed: true },
    });
    res.json(updatedSession);
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
};
