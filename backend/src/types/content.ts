export enum ContentFormat {
  ARTICLE = "ARTICLE",
  PAPER = "PAPER",
  VIDEO = "VIDEO",
  AUDIO = "AUDIO",
}
// const { limit = 10, offset = 0, topic, format, time } = req.query;
export interface GetContentQuery {
  limit?: string;
  offset?: string;
  topic?: string;
  format?: string;
  time?: string;
}

// const {limit = 10, offset = 0, keyword, topic, time, difficulty} = req.query;
export interface SearchContentQuery {
  limit?: string;
  offset?: string;
  topic?: string;
  time?: string;
  difficulty?: string;
}
// {id} = req.params
export interface ContentByIDParams {
  id: string;
}

// const { title, description, sourceName, sourceUrl, format, topic, estimatedTime, difficulty, licenseType } = req.body;
export interface ContentCreationRequest {
  title: string;
  description: string;
  sourceName: string;
  sourceUrl: string;
  format: ContentFormat;
  topic: string;
  estimatedTime: number;
  difficulty: number;
  licenseType: string;
}

// exports Contents
export interface ContentResponse {
  id: string;
  title: string;
  description: string;
  sourceName: string;
  sourceUrl: string;
  format: ContentFormat;
  topic: string;
  estimatedTime: number;
  difficulty: number;
  licenseType: string;
  createdAt: Date;
}

export interface ContentUpdateRequest {
  title?: string;
  description?: string;
  sourceName?: string;
  sourceUrl?: string;
  format?: ContentFormat;
  topic?: string;
  estimatedTime?: number;
  difficulty?: number;
  licenseType?: string;
}

export interface PaginatedContentResponse {
  content: ContentResponse[];
  total: number;
}
export interface ErrorResponse {
  error: string;
}
