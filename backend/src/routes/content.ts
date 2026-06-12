// const express = require('express');
// const router = express.Router();
// const isAdmin = require('../middleware/admin');
// const {updateContent,deleteContent,createContent, getContent, getPiece, searchContent} = require('../controllers/contentController');
import express from "express";
import isAdmin from "../middleware/admin"
import {updateContent,deleteContent,createContent, getContent, getPiece, searchContent} from "../controllers/contentController";

const contentRouter = express.Router();

contentRouter.get('/content', getContent);
contentRouter.get('/content/search', searchContent);
contentRouter.get('/content/:id', getPiece);
contentRouter.put('/content/update/:id', isAdmin, updateContent);
contentRouter.delete('/content/delete/:id', isAdmin, deleteContent);
contentRouter.post('/content/create', isAdmin, createContent);
export {contentRouter};
