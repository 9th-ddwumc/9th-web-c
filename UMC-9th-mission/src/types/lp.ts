import type { CommonResponse, CursorBasedResponse } from "./common";

export type Tag = {
    id: number;
    name: string;
};

export type Likes = {
    id: number;
    userId: number;
    lpId: number;
};

export type Lp = {
  id: number;
  title: string;
  content: string;
  thumbnail: string;
  published: boolean;
  authorId: number;
  createdAt: Date;
  updatedAt: Date;
  tags: Tag[];
  likes: Likes[];
}

export type RequestLpDetailDto = {
  lpId: number;
}

export type ResponseLpListDto = CursorBasedResponse<Lp[]>; 

export type ResponseLpDetailDto = CursorBasedResponse<LpDetail>;

export interface LpDetail {
  id: number;
  title: string;
  content: string;
  thumbnail: string;
  published: boolean;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  tags: { id: number; name: string }[];
  likes: { id: number; userId: number; lpId: number }[];
  author: {
    id: number;
    name: string;
    email: string;
    bio?: string | null;
    avatar?: string | null;
    createdAt: string;
    updatedAt: string;
  };
}


export type ResponseLikeLpDto = CommonResponse<{
  id:number;
  useId:number;
  lpId:number;
}>