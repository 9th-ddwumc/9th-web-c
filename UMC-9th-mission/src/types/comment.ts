import type { CursorBasedResponse } from "./common";

export type Author = {
    id: number;
    name: string;
    email: string;
    bio: string|null;
    avatar: string|null;
    createdAt:string;
    updatedAt:string;
};

export type Comment = {
    id:number;
    content:string;
    lpId:number;
    authorId:number;
    createdAt:string;
    updatedAt:string;
    author: Author;
        
}

export interface ResponseCommentListDto {
  data: {
    data: Comment[];
    nextCursor: number | null;
    hasNext: boolean;
  };
}



