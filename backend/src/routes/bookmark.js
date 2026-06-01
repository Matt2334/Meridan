const express = require("express");
const router = express.Router();
const { createBookmark, deleteBookmark, getBookmarks, getBookmark } = require("../controllers/bookmarkController");
const authJWT = require("../middleware/auth");


router.post("/bookmark", authJWT, createBookmark);
router.delete("/bookmark", authJWT, deleteBookmark);
router.get("/bookmarks", authJWT, getBookmarks);
router.get("/bookmark/:contentId", authJWT, getBookmark);
module.exports = router;
