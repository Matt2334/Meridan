const { Prisma } = require("../../prisma/library/prisma");
const generateSession = async ({ userId, time, topic, formats }) => {
  const parsedTime = Number(time);

  if (Number.isNaN(parsedTime)) {
    throw new Error("Invalid time value");
  }

  console.log(
    `Generating session for user ${userId} with ${parsedTime} minutes available...`,
  );

  const usedContentIds = await Prisma.sessionItem
    .findMany({
      where: { session: { userId }, completed:true },
      select: { contentId: true },
    })
    .then((items) => items.map((item) => item.contentId));
  const isMixed = !formats || formats.includes("MIXED");

  let contentPool = [];
  if (topic === "ANY") {
    contentPool = await Prisma.content.findMany({
      where: {
        estimatedTime: { lte: Number(time) },
        id: { notIn: usedContentIds },
      },
    });
    if (contentPool.length === 0) {
      contentPool = await Prisma.content.findMany({
        where: {
          estimatedTime: { lte: Number(time) },
        },
      });
    }
  } else {
    contentPool = await Prisma.content.findMany({
      where: {
        topic: topic,
        estimatedTime: { lte: Number(time) },
        id: { notIn: usedContentIds },
      },
    });

    if (contentPool.length === 0) {
      contentPool = await Prisma.content.findMany({
        where: {
          topic: topic.toUpperCase(),
          estimatedTime: { lte: Number(time) },
        },
      });
    }
  }
  const selected = fitContentToTime(contentPool, time);
  if (selected.length === 0) {
    throw new Error("No content available for the selected topic and time");
  }

  const session = await Prisma.session.create({
    data: {
      userId,
      timeAvailable: time,
      sessionType: selected.length === 1 ? "SINGLE" : "BUNDLE",
      sessionItems: {
        create: selected.map((item, index) => ({
          contentId: item.id,
          orderIndex: index,
        })),
      },
      topic: topic.toUpperCase(),
    },
    include: {
      sessionItems: {
        include: {
          content: true,
        },
      },
    },
  });

  return session;
};

const fitContentToTime = (contentPool, time) => {
  const shuffled = [...contentPool].sort(() => Math.random() - 0.5);
  let totalTime = 0;
  let selected = [];
  for (const content of shuffled) {
    if (totalTime + content.estimatedTime <= time) {
      totalTime += content.estimatedTime;
      selected.push(content);
    }
  }
  return selected;
};

module.exports = { generateSession };
