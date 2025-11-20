import type { PaginationDto } from "../types/common";
import type { AddLpDto, DeleteLpDto, RequestLpDto, ResponseLikeLpDto, ResponseLpDto, ResponseLpListDto, UpdateLpDto, UpdateLpResponse } from "../types/lp";
import { axiosInstance } from "./axios";

export const getLpList = async (
  PaginationDto: PaginationDto,
): Promise<ResponseLpListDto> => {
  const { data } = await axiosInstance.get('/v1/lps', {
    params: PaginationDto
  });

  return data;
};

export const getLpDetail = async ({
  lpId
}: RequestLpDto): Promise<ResponseLpDto> => {
  const { data } = await axiosInstance.get(`/v1/lps/${lpId}`);

  return data;
};

export const postLike = async({
  lpId
}: RequestLpDto): Promise<ResponseLikeLpDto> => {
  const { data } = await axiosInstance.post(`/v1/lps/${lpId}/likes`);

  return data;
};

export const deleteLike = async({
  lpId
}: RequestLpDto): Promise<ResponseLikeLpDto> => {
  const { data } = await axiosInstance.delete(`/v1/lps/${lpId}/likes`);

  return data;
};

export const addLp = async (lp: AddLpDto) => {
  const { data } = await axiosInstance.post("/v1/lps", lp);
  return data;
};

export const updateLp = async ({
  lpId,
  ...data
}: UpdateLpDto): Promise<UpdateLpResponse> => {
  const { data: res } = await axiosInstance.patch(`/v1/lps/${lpId}`, data);
  return res;
};

export const deleteLp = async({
  lpId
}: DeleteLpDto): Promise<DeleteLpDto> => {
  const { data } = await axiosInstance.delete(`/v1/lps/${lpId}`);
  return data;
}