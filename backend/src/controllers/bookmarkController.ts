import { Prisma } from "../../prisma/library/prisma";
import { Request, Response } from "express";
import {BookmarkBodyRequest, BookmarkResponse, GetBookmarkQuery, PaginatedBookmarkResponse, GetBookmarkParams, ErrorResponse } from "../types";


const createBookmark = async (req: Request<{},{},BookmarkBodyRequest>, res:Response<BookmarkResponse | ErrorResponse>):Promise<void> => {
  const { contentId } = req.body;
  const userId = req.user?.userId;
  try {
    const content = await Prisma.content.findUnique({
      where: { id: contentId },
    });
    if (!content) {res.status(404).json({ error: "Content not found" });return;}
    const bookmark = await Prisma.bookmark.create({
      data: {
        userId,
        contentId,
      },
    });
    res.status(201).json({ message: "Bookmark created" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: (err as Error).message });
  }
};

const deleteBookmark = async (req:Request<{},{},BookmarkBodyRequest>, res:Response<BookmarkResponse|ErrorResponse>) => {
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
    console.error(err);
    return res.status(500).json({ error: (err as Error).message });
  }
};

const getBookmarks = async (req:Request<{},{},{},GetBookmarkQuery>, res:Response<PaginatedBookmarkResponse|ErrorResponse>) => {
  const userId = req.user?.userId;
  const { limit = '5', offset = '0' } = req.query;
  try {
    const user = await Prisma.user.findUnique({where:{id:userId}})
    const [bookmarks, total] =  await Prisma.$transaction([ Prisma.bookmark.findMany({
      where: { userId },
      include: { content: true },
      orderBy: { createdAt: "desc" },
      skip: parseInt(offset),
      take: parseInt(limit),
    }),
     Prisma.bookmark.count({ where: { userId } })
    ]);
    return res.json({ total, bookmarks });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: (err as Error).message });
  }
};


interface isBookmarked{
  bookmarked: boolean;
}
const getBookmark = async (req:Request<GetBookmarkParams>,res:Response<isBookmarked|ErrorResponse>)=>{
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
export{ createBookmark, deleteBookmark, getBookmarks, getBookmark };
