import { RequestPostCommentDto, ResponseCommentDto, ResponseCommentListDto } from "../types/comment";
import { PagenationDto } from "../types/common";
import { axiosInstance } from "./axios";

export const getCommentList = async (
    lpid: number,
    pagenationDto: PagenationDto
): Promise<ResponseCommentListDto> => {
  const { data } = await axiosInstance.get(`/v1/lps/${lpid}/comments`, {
    params: pagenationDto,
  });
  console.log("📥 Comment 상세 응답:", data);
  return data;
};

export const postComment = async ({lpId, content}:RequestPostCommentDto): Promise<ResponseCommentDto> => {
  const { data } = await axiosInstance.post(`/v1/lps/${lpId}/comments`, {content});
  return data;
};

export const deleteComment = async({lpId, id}:{lpId:number, id:number}) => {
  const {data} = await axiosInstance.delete(`/v1/lps/${lpId}/comments/${id}`);
  return data;
};

export const patchComment = async({lpId, id, content}:{lpId:number, id:number, content:string}) : Promise<ResponseCommentDto> => {
  const {data} = await axiosInstance.patch(`/v1/lps/${lpId}/comments/${id}`, {content});
  return data;
};