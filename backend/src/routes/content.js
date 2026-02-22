const express = require('express');
const router = express.Router();
const isAdmin = require('../middleware/admin');
const {updateContent,deleteContent,createContent, getContent, getPiece, searchContent} = require('../controllers/contentController');

router.get('/content', getContent);
router.get('/content/search', searchContent);
router.get('/content/:id', getPiece);
router.put('/content/update/:id', isAdmin, updateContent);
router.delete('/content/delete/:id', isAdmin, deleteContent);
router.post('/content/create', isAdmin, createContent);
module.exports = router;
