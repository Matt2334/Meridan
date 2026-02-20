const express = require('express');
const router = express.Router();
const {getContent, getPiece, searchContent} = require('../controllers/contentController');

router.get('/content', getContent);
router.get('/content/search', searchContent);
router.get('/content/:id', getPiece);

module.exports = router;

