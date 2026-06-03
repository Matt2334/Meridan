const { Prisma } = require("../../prisma/library/prisma");

const createBookmark = async (req, res) => {
  const { contentId } = req.body;
  const userId = req.user?.userId;
  try {
    const content = await Prisma.content.findUnique({
      where: { id: contentId },
    });
    if (!content) return res.status(404).json({ error: "Content not found" });
    const bookmark = await Prisma.bookmark.create({
      data: {
        userId,
        contentId,
      },
    });
    return res.status(201).json({ message: "Bookmark created" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
};
const deleteBookmark = async (req, res) => {
  const { contentId } = req.body;
  const userId = req.user?.userId;
  try {
    const user = await Prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: "User not found" });
    const content = await Prisma.content.findUnique({
      where: { id: contentId },
    });
    if (!content) return res.status(404).json({ error: "Content not found" });

    const bookmark = await Prisma.bookmark.findFirst({
      where: { userId, contentId },
    });
    if (!bookmark) return res.status(404).json({ error: "Bookmark not found" });
    await Prisma.bookmark.delete({ where: { id: bookmark.id } });
    return res.json({ message: "Bookmark deleted" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
};
const getBookmarks = async (req, res) => {
  const userId = req.user?.userId;
  const { limit = 5, offset = 0 } = req.query;
  try {
    const user = await Prisma.user.findUnique({where:{id:userId}})
    const total = await Prisma.bookmark.count({ where: { userId } });
    const bookmarks = await Prisma.bookmark.findMany({
      where: { userId },
      include: { content: true },
      orderBy: { createdAt: "desc" },
      skip: parseInt(offset),
      take: parseInt(limit),
    });
    return res.json({ total, bookmarks });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
};
const getBookmark = async (req,res)=>{
  const userId = req.user?.userId;
  const contentId = req.params.contentId;
  try{
    const user = await Prisma.user.findUnique({where:{id:userId}})
    if(!user) return res.status(404).json({error:"User not found"});
    const content = await Prisma.content.findUnique({where:{id:contentId}});
    if(!content) return res.status(404).json({error:"Content not found"});

    const bookmark = await Prisma.bookmark.findFirst({where:{userId, contentId}});
    return res.json({bookmarked: !!bookmark});
  }catch(err){
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
}
module.exports = { createBookmark, deleteBookmark, getBookmarks, getBookmark };
