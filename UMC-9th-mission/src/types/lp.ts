import type { CommonReponse, CursorBasedResponse } from "./common";

//태그(Tag) 타입 정의
export type Tag = {
    id:number;
    name:string;
};

//좋아요(Likes) 관계 타입 정의
export type Likes = {
    id:number;
    userId:number;
    lpId:number;
}

//개별 LP(Lp) 데이터 타입 정의
export type Lp={
  id: number;
  title: string;
  content: string;
  thumbnail: string;
  published: boolean;
  authorId: number;
  createdAt: string;
  updatedAt: Date;
  tags: Tag[];
  likes: Likes[];
}

//LP '목록' 조회 API 응답(ResponseLpListDto) 타입 정의
export type ResponseLpListDto = CursorBasedResponse<Lp[]>;

//LP '상세' 조회 API 응답(ResponseLpDetailDto) 타입 정의
export interface ResponseLpDetailDto {
  data: {
    id: number;
    title: string;
    content: string;
    thumbnail: string;
    published: boolean;
    authorId: number;
    createdAt: string;
    updatedAt: string;
    tags: Tag[];
    likes: Likes[];
  };
}

export type RequestLpDto = {
  lpId:number;
};

export type ResponseLpDto = CommonReponse<Lp>;

export type ResponseLikeLpDto = CommonReponse<{
  id: number;
  userId: number;
  lpId: number;
}>;

export type RequestCreateLpDto = {
  title: string;
  content: string;
  thumbnail: string; 
  tags: string[];
  published: boolean;
};

/** LP 수정 시 API로 보낼 DTO */
export interface RequestUpdateLpDto {
  title: string;
  content: string;
}

/** LP 삭제 API 응답 타입 (메시지만 반환 가정) */
export type ResponseDeleteLpDto = CommonReponse<boolean>;