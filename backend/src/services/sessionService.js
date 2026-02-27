const { PrismaClient } = require('../generated/client');
const {PrismaPg} = require('@prisma/adapter-pg');
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const Prisma = new PrismaClient({ adapter });

const generateSession = async ({ userId, timeAvailable, topics, formats }) => {
  console.log(
    `Generating session for user ${userId} with ${timeAvailable} minutes available...`,
  );

  const userSessions = await prisma.session.findMany({
    where: { userId },
    include: { sessionItems: { select: { contentId: true } } },
  });

  const usedContentIds = userSessions.flatMap((s) => 
    s.sessionItems.map((item) => item.contentId)
  );

  const contentPool = await prisma.content.findMany({
    where: {
      topic: {in: topics},
      estimatedTime: { lte: timeAvailable },
      id: { notIn: usedContentIds },
      format: { in: formats },
    },
  });

  const selected = fitContentToTime(contentPool, timeAvailable);

  const session = await prisma.session.create({
    data: {
      userId,
      timeAvailable,
      sessionType: selected.length === 1 ? "SINGLE" : "BUNDLE",
      sessionItems: {
        create: selected.map((item, index) => ({
          contentId: item.id,
          orderIndex: index,
        })),
      },
      include: {sessionItems: {
        include: {
          content: true,
        },
      }},
    },
  });

  return session;
};

const fitContentToTime = (contentPool, timeAvailable) => {
  let totalTime = 0;
  let selected = [];
  for (content of contentPool) {
    if (totalTime + content.estimatedTime <= timeAvailable) {
      totalTime += content.estimatedTime;
      selected.push(content)
    } 
  }
  return selected;
};

module.exports = { generateSession };