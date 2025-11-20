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
};

export type RequestLpDto = {
  lpId: number;
}

export type ResponseLpDto = CommonResponse<Lp>

export type ResponseLpListDto = CursorBasedResponse<Lp[]>;

export type ResponseLikeLpDto = CommonResponse<{
  id: number;
  userId: number;
  lpId: number;
}>

export type AddLpDto = {
  title: string;
  content: string;
  thumbnail?: string;
  tags: string[];
  published: boolean;
};

export type UpdateLpDto = {
  lpId: number;
  title?: string;
  content?: string;
  thumbnail?: string;
  tags?: string[];
  published?: boolean;
}

export type DeleteLpDto = {
  lpId: number;
};

export type addLpRsponse = CommonResponse<Lp>;

export type UpdateLpResponse = CommonResponse<Lp>;

export type DeleteLpResponse = CommonResponse<boolean>;