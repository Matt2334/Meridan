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
    if (session.takeaways && session.talkingPoints){
        return res.status(200).json({
            takeaways: session.takeaways,
            conversationStarters: session.talkingPoints
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
You are a learning assistant for Meridian, an intellectual learning platform.

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
        completedAt: new Date()
      }
    });

    res.status(200).json(parsed);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
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
//   crossConnections
};
