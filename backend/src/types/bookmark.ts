import { ContentResponse } from "./content";

export interface BookmarkBodyRequest {
  contentId?: string;
}

export interface BookmarkResponse{
    message:string;
}
export interface GetBookmarkQuery {
  limit?: string;
  offset?: string;
}

export interface GetBookmarkParams {
  contentId?: string;
}

interface BookmarkWithContent{
  id:string;
  userId:string;
  contentId:string;
  createdAt:Date;
  content:ContentResponse;
}
export interface PaginatedBookmarkResponse{
  bookmarks: BookmarkWithContent[];
  total: number;
}