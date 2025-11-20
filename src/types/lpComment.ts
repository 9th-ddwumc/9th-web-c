import type { CommonResponse, CursorBasedResponse } from "./common";

export interface LpComment {
  id: number;
  content: string;
  lpId: number;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  author: {
    id: number;
    name: string;
    email: string;
    bio: string | null;
    avatar: string | null;
    createdAt: string;
    updatedAt: string;
  };
};

export type CommentsResponse = CursorBasedResponse<LpComment[]>;

export type CreateCommentDto = {
  lpId: number;
  content: string;
};

export interface UpdateCommentDto {
  lpId: number;
  id: number;
  content: string;
}

export interface DeleteCommentDto {
  lpId: number;
  id: number;
}

export type UpdateCommentResponse = CommonResponse<LpComment>;

export type CreateCommentResponse = CommonResponse<LpComment>;

export type DeleteCommentResponse = CommonResponse<null>;