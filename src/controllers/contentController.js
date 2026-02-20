const db = require("../db");
const { PrismaClient } = require("@prisma/client");
const Prisma = new PrismaClient();
// router.get('/content', getContent);
const getContent = async (req, res) => {
  try {
    const { limit = 10, offset = 0, topic, format, time } = req.query;
    const where = {};
    if (topic) where.topic = topic;
    if (format) where.format = format;
    if (time) where.time = time;
    
    const content = await Prisma.content.findMany({
        where,
        take: parseInt(limit),
        skip: parseInt(offset),
    });
    if (!content.length) return res.status(404).json({ error: "No content found" });
    res.json(content);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

// router.get('/search', searchContent);
const searchContent = async (req, res) => {
    try {
        const {limit = 10, offset = 0, keyword, topic, time, difficulty} = req.query;
        const where = {};
        if (keyword) where.keyword = keyword;
        if (topic) where.topic = topic;
        if (time) where.time = time;
        if (difficulty) where.difficulty = difficulty;

        const content = await Prisma.content.findMany({
            where,
            take: parseInt(limit),
            skip: parseInt(offset),
        });
        if (!content.length) return res.status(404).json({ error: "No matching content found" });
        
        res.json(content);
    }catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
};

// router.get('/:id', getPiece);
const getPiece = async (req, res) => {
    try {
        const { id } = req.params;
        const content = await Prisma.content.findUnique({
            where: { id: parseInt(id) },
        });
        if (!content) return res.status(404).json({ error: "Content not found" });
        res.json(content);
    }catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
};
const createContent = async (req, res) => {
    try {
        
    }catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
};
const updateContent = async (req, res) => {
    try {
        
    }catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
};
const deleteContent = async (req, res) => {
    try {
        
    }catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
  getContent,
  searchContent,
  getPiece,
  createContent,
  updateContent,
  deleteContent,
};
