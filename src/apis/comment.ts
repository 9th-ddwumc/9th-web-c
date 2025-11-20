import type { CreateCommentDto, CreateCommentResponse, DeleteCommentDto, DeleteCommentResponse, UpdateCommentDto, UpdateCommentResponse } from "../types/lpComment";
import { axiosInstance } from "./axios";

export const createComment = async (
  data: CreateCommentDto
): Promise<CreateCommentResponse> => {
  const { data: res } = await axiosInstance.post(`/v1/lps/${data.lpId}/comments`, {
    content: data.content,
  });
  return res;
};

export const updateComment = async ({
  lpId,
  id,
  content,
}: UpdateCommentDto): Promise<UpdateCommentResponse> => {
  const { data } = await axiosInstance.patch(`/v1/lps/${lpId}/comments/${id}`, {
    content,
  });
  return data;
};

export const deleteComment = async ({
  lpId,
  id,
}: DeleteCommentDto): Promise<DeleteCommentResponse> => {
  const { data } = await axiosInstance.delete(`/v1/lps/${lpId}/comments/${id}`);
  return data;
};