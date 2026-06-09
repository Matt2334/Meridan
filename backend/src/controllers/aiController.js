const { Prisma } = require("../../prisma/library/prisma");
const { GoogleGenAI } = require("@google/genai");
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const generateTakeaways = async (req, res) => {
  const { sessionId } = req.params;
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  try {
    const session = await Prisma.session.findUnique({
      where: { id: sessionId, userId },
      include: { sessionItems: { include: { content: true } } },
    });
    if (!session) return res.status(404).json({ message: "Session not found" });
    if (session.userId !== userId)
      return res.status(403).json({ error: "Unauthorized" });
    if (session.takeaways && session.talkingPoints) {
      return res.status(200).json({
        takeaways: session.takeaways,
        conversationStarters: session.talkingPoints,
      });
    }
    const contentSummaryArr = await Promise.all(
      session.sessionItems.map(async (item, i) => {
        const content = await Prisma.content.findUnique({
          where: { id: item.contentId },
        });
        return `Article ${i + 1}: ${content.title} - ${content.description}`;
      }),
    );
    const contentSummary = contentSummaryArr.join("\n");

    const r = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `
You are a learning assistant for Meridan, an intellectual learning platform.

Based on the following articles from a learning session, generate:
1. Four concise bullet point takeaways (the most important ideas across all articles)
2. Two conversation starters (thought-provoking questions this session raises)

${contentSummary}

Respond in this exact JSON format with no preamble:
{
  "takeaways": ["takeaway 1", "takeaway 2", "takeaway 3"],
  "conversationStarters": ["question 1", "question 2"]
}
        `,
    });
    const raw = r.candidates[0].content.parts[0].text;
    const parsed = JSON.parse(raw);
    await Prisma.session.update({
      where: { id: sessionId },
      data: {
        takeaways: parsed.takeaways,
        talkingPoints: parsed.conversationStarters,
        // completedAt: new Date(),
      },
    });

    res.status(200).json(parsed);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

const crossConnections = async ({ id, userId }) => {
  try {
    const isConnection = await Prisma.sessionConnection.findMany({where:{fromSessionId:id}})
    // if (isConnection) return "sucessful"
    const session = await Prisma.session.findUnique({
      where: { id, userId },
      include: {
        sessionItems: {
          include: { content: true },
        },
      },
    });
    const pastSessions = await Prisma.session.findMany({
      where: { id: { not: id }, userId, completedAt: { not: null } },
      include: {
        sessionItems: {
          include: { content: true },
        },
      },
    });
    if (pastSessions.length === 0) return;
    const r = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Given this completed session:
Topic: ${session.topic}
Content: ${session.sessionItems.map((i) => i.content.title).join(", ")}

And these past sessions:
${pastSessions.map(s => `- ID: ${s.id} | Topic: ${s.topic} | Content: ${s.sessionItems.map(i => i.content.title).join(", ")}`).join("\n")}

Return a JSON array of connections with strength 0-1 and a one-sentence reason:
[{ "sessionId": "...", "strength": 0.8, "reason": "Both explore..." }]
Only include connections with strength > 0.3.
`,
    });
    const raw = r.candidates[0].content.parts[0].text;
    const clean = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    await Promise.all(
      parsed.map((conn) => 
        Prisma.sessionConnection.create({
          data: {
            fromSessionId: id,
            toSessionId: conn.sessionId,
            strength: conn.strength,
            reason: conn.reason,
          },
        })
      )
    );
  // console.log(connections)
  } catch (err) {
    console.error(err);
    throw new Error("Error creating connection")
  }
};

// cross topic connections might add after changing the content schema to include more metadata.
// const crossConnections = async (req,res)=>{
//     const userId = req.user?.userId;
//     try{

//     }catch(err){
//         console.error(err);
//         res.status(500).json({ error: err.message });
//     }
// }

module.exports = {
  generateTakeaways,
  crossConnections,
};
