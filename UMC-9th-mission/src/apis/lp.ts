import { axiosInstance } from "./axios";
import type { PaginationDto } from "../types/common";
import type { RequestCreateLpDto, RequestLpDto, RequestUpdateLpDto, ResponseDeleteLpDto, ResponseLikeLpDto, ResponseLpDto, ResponseLpListDto } from "../types/lp";
import type { ApiResponse, RequestCreateCommentDto } from "../types/comment";


export const getLpList = async (
  paginationDto: PaginationDto
): Promise<ResponseLpListDto> => {
  //구조분해할당
  const { data } = await axiosInstance.get("/v1/lps", { params: paginationDto });
  return data;
};
//  LP 상세 가져오기 
export const getLpDetail = async ({lpId}: RequestLpDto):Promise<ResponseLpDto> => {
  const { data } = await axiosInstance.get(`/v1/lps/${lpId}`);
  return data;
};

// LP 좋아요 추가
export const postLike = async({lpId}: RequestLpDto):Promise<ResponseLikeLpDto> => {
  const{data} = await axiosInstance.post(`/v1/lps/${lpId}/likes`);

  return data;
};

// LP 좋아요 삭제
export const deleteLike = async({lpId}: RequestLpDto):Promise<ResponseLikeLpDto>  => {
  const{data} = await axiosInstance.delete(`/v1/lps/${lpId}/likes`);

  return data;
};

// LP 생성 (글 작성)
export const postLp = async (
  lpData: RequestCreateLpDto,
): Promise<ResponseLpDto> => {
  // lpData 객체를 JSON으로 전송합니다.
  const { data } = await axiosInstance.post("/v1/lps", lpData, {
    // (axios가 자동으로 Content-Type: application/json으로 설정)
  });
  return data;
};

/* 댓글 생성 API 함수 
 * - lpId로 어느 LP에 속한 댓글인지 명시하고,
 * - body에는 { content }만 담아 전송
 */
export const postComment = async ({
  lpId,
  content,
}: RequestCreateCommentDto): Promise<ApiResponse<Comment>> => {
  const { data } = await axiosInstance.post(
    `/v1/lps/${lpId}/comments`,
    { content } // API 스펙에 따라 body에 content만 전송
  );
  return data;
};


// 댓글 수정 DTO
export interface RequestUpdateCommentDto {
  content: string;
}

// 댓글 수정 
export const updateComment = async ({
  lpId,
  commentId,
  content,
}: {
  lpId: number;
  commentId: number;
  content: string;
}): Promise<ApiResponse<Comment>> => {
  const { data } = await axiosInstance.patch(
    `/v1/lps/${lpId}/comments/${commentId}`, 
    { content }
  );
  return data; // 응답으로 Comment 객체를 받음
};

// 댓글 삭제 
export const deleteComment = async ({
  lpId,
  commentId,
}: {
  lpId: number;
  commentId: number;
}): Promise<ApiResponse<{ message: string }>> => { 
  const { data } = await axiosInstance.delete(
    `/v1/lps/${lpId}/comments/${commentId}` 
  );
  return data; // 응답으로 { message: "..." } 객체를 받음
};

/** LP 수정 API */
export const updateLp = async ({
  lpId,
  dto,
}: {
  lpId: number;
  dto: RequestUpdateLpDto;
}): Promise<ResponseLpDto> => {
  const { data } = await axiosInstance.patch(`/v1/lps/${lpId}`, dto);
  return data;
};

/** LP 삭제 API */
export const deleteLp = async ({
  lpId,
}: RequestLpDto): Promise<ResponseDeleteLpDto> => {
  const { data } = await axiosInstance.delete(`/v1/lps/${lpId}`);
  return data;
};