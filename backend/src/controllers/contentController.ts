import { Prisma } from "../../prisma/library/prisma";
import { Request, Response } from "express";
import {
  GetContentQuery,
  SearchContentQuery,
  ContentByIDParams,
  ContentCreationRequest,
  ContentResponse,
  ContentUpdateRequest,
  ErrorResponse,
  PaginatedContentResponse,
} from "../types";

// Request<Params, ResBody, ReqBody, QueryParams>

// router.get('/content', getContent);
const getContent = async (
  req: Request<{}, {}, {}, GetContentQuery>,
  res: Response<ContentResponse[] | ErrorResponse>,
): Promise<void> => {
  try {
    const { limit = "10", offset = "0", topic, format, time } = req.query;
    const where: {
      topic?: String;
      format?: String;
      estimatedTime?: { lte: number };
    } = {};
    if (topic && topic !== "any") where.topic = topic.toUpperCase();
    if (format) where.format = format;
    if (time) where.estimatedTime = { lte: parseInt(time) };

    const content = await Prisma.content.findMany({
      where,
      take: parseInt(limit),
      skip: parseInt(offset),
    });
    if (!content.length) {
      res.status(404).json({ error: "No content found" });
      return;
    }
    res.status(200).json(content as ContentResponse[]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: (err as Error).message });
  }
};

// router.get('/search', searchContent);
const searchContent = async (
  req: Request<{}, {}, {}, SearchContentQuery>,
  res: Response<ContentResponse[] | ErrorResponse>,
) => {
  try {
    const {
      limit = "10",
      offset = "0",
      //   keyword,
      topic,
      time,
      difficulty,
    } = req.query;
    const where: {
      topic?: string;
      estimatedTime?: { lte: number };
      difficulty?: number;
    } = {};
    // if (keyword) where.keyword = keyword;
    if (topic) where.topic = topic;
    if (time) where.estimatedTime = { lte: parseInt(time) };
    if (difficulty) where.difficulty = parseInt(difficulty);

    const content = await Prisma.content.findMany({
      where,
      take: parseInt(limit),
      skip: parseInt(offset),
    });
    if (!content.length) {
      res.status(404).json({ error: "No matching content found" });
      return;
    }
    res.status(200).json(content as ContentResponse[]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: (err as Error).message });
  }
};

// router.get('/:id', getPiece);
const getPiece = async (
  req: Request<ContentByIDParams>,
  res: Response<ContentResponse | ErrorResponse>,
) => {
  try {
    const { id } = req.params;
    const content = await Prisma.content.findUnique({
      where: { id },
    });
    if (!content) {
      res.status(404).json({ error: "Content not found" });
      return;
    }
    res.status(200).json(content);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: (err as Error).message });
  }
};

const createContent = async (
  req: Request<{}, {}, ContentCreationRequest>,
  res: Response<ContentResponse | ErrorResponse>,
) => {
  const {
    title,
    description,
    sourceName,
    sourceUrl,
    format,
    topic,
    estimatedTime,
    difficulty,
    licenseType,
  } = req.body;
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
        licenseType,
      },
    });
    res.status(201).json(newContent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: (err as Error).message });
  }
};
const updateContent = async (
  req: Request<ContentByIDParams, {}, ContentUpdateRequest>,
  res: Response<ContentResponse | ErrorResponse>,
) => {
  const { id } = req.params;
  const {
    title,
    description,
    sourceName,
    sourceUrl,
    format,
    topic,
    estimatedTime,
    difficulty,
    licenseType,
  } = req.body;
  try {
    if (!id) {
      res.status(400).json({ error: "Content ID is required" });
      return;
    }
    const content = await Prisma.content.findUnique({ where: { id } });
    if (!content) {
      res.status(404).json({ error: "Content not found" });
      return;
    }

    const updatedContent = await Prisma.content.update({
      where: { id },
      data: {
        title,
        description,
        sourceName,
        sourceUrl,
        format,
        topic,
        estimatedTime,
        difficulty,
        licenseType,
      },
    });
    res.json(updatedContent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: (err as Error).message });
  }
};
const deleteContent = async (
  req: Request<ContentByIDParams>,
  res: Response<{ message: string } | ErrorResponse>,
) => {
  const { id } = req.params;
  try {
    if (!id) {
      res.status(400).json({ error: "Content ID is required" });
      return;
    }
    const content = await Prisma.content.findUnique({ where: { id } });
    if (!content) {
      res.status(404).json({ error: "Content not found" });
      return;
    }
    await Prisma.content.delete({ where: { id } });
    res.json({ message: "Content deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: (err as Error).message });
  }
};

export {
  getContent,
  searchContent,
  getPiece,
  createContent,
  updateContent,
  deleteContent,
};
