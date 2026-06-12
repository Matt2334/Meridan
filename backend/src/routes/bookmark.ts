import express from "express";
import { createBookmark, deleteBookmark, getBookmarks, getBookmark } from "../controllers/bookmarkController";
import authJWT from "../middleware/auth";

const bookmarkRouter = express.Router();

bookmarkRouter.post("/bookmark", authJWT, createBookmark);
bookmarkRouter.delete("/bookmark", authJWT, deleteBookmark);
bookmarkRouter.get("/bookmarks", authJWT, getBookmarks);
bookmarkRouter.get("/bookmark/:contentId", authJWT, getBookmark);
export {bookmarkRouter};
