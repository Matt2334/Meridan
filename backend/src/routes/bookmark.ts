import express from "express";
const router = express.Router();
import { createBookmark, deleteBookmark, getBookmarks, getBookmark } from "../controllers/bookmarkController";
import authJWT from "../middleware/auth";


router.post("/bookmark", authJWT, createBookmark);
router.delete("/bookmark", authJWT, deleteBookmark);
router.get("/bookmarks", authJWT, getBookmarks);
router.get("/bookmark/:contentId", authJWT, getBookmark);
module.exports = router;
