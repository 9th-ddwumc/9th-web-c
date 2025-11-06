import { ResponseCommentListDto } from "../types/comment";
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