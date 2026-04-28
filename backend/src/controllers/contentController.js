const { PrismaClient } = require('../generated');
const {PrismaPg} = require('@prisma/adapter-pg');
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const Prisma = new PrismaClient({ adapter });

// router.get('/content', getContent);
const getContent = async (req, res) => {
  try {
    const { limit = 10, offset = 0, topic, format, time } = req.query;
    const where = {};
    if (topic) where.topic = topic.toUpperCase();
    if (format) where.format = format;
    if (time) where.estimatedTime = {lte: parseInt(time)} ;
    
    const content = await Prisma.content.findMany({
        where,
        take: parseInt(limit),
        skip: parseInt(offset),
    });
    if (!content.length) return res.status(404).json({ error: "No content found" });
    console.log(content);
    return res.status(200).json(content);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
};

// router.get('/search', searchContent);
const searchContent = async (req, res) => {
    try {
        const {limit = 10, offset = 0, keyword, topic, time, difficulty} = req.query;
        const where = {};
        if (keyword) where.keyword = keyword;
        if (topic) where.topic = topic;
        if (time) where.estimatedTime = {lte: parseInt(time)};
        if (difficulty) where.difficulty = parseInt(difficulty);

        const content = await Prisma.content.findMany({
            where,
            take: parseInt(limit),
            skip: parseInt(offset),
        });
        if (!content.length) return res.status(404).json({ error: "No matching content found" });
        
        return res.status(200).json(content);
    }catch (err) {
        console.log(err);
        return res.status(500).json({ error: err.message });
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
    const { title, description, sourceName, sourceUrl, format, topic, estimatedTime, difficulty, licenseType } = req.body;
    try {
        const newContent = await Prisma.content.create({
            data: {
                title,
                description,
                sourceName,
                sourceUrl,
                format,
                topic,
                estimatedTime,
                difficulty,
                licenseType
            }
        });
        res.status(201).json(newContent); 
    }catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
};
const updateContent = async (req, res) => {
    const {id} = req.params;
    const { title, description, sourceName, sourceUrl, format, topic, estimatedTime, difficulty, licenseType } = req.body;
    try {
        if (!id) return res.status(400).json({ error: "Content ID is required" });
        const content = await Prisma.content.findUnique({ where: { id: parseInt(id) } });
        if (!content) return res.status(404).json({ error: "Content not found" });  

        const updatedContent = await Prisma.content.update({
            where: { id: parseInt(id) },
            data: {
                title,
                description,
                sourceName,
                sourceUrl,
                format,
                topic,
                estimatedTime,
                difficulty,
                licenseType
            }
        });
        res.json(updatedContent);
    }catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
};
const deleteContent = async (req, res) => {
    const {id} = req.params;
    try {
        if (!id) return res.status(400).json({ error: "Content ID is required" });
        const content = await Prisma.content.findUnique({ where: { id: parseInt(id) } });
        if (!content) return res.status(404).json({ error: "Content not found" });  
        await Prisma.content.delete({ where: { id: parseInt(id) } });
        res.json({ message: "Content deleted successfully" });
        
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
