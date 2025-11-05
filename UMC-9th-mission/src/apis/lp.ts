import { axiosInstance } from "./axios";
import type { PaginationDto } from "../types/common";
import type { ResponseLpListDto } from "../types/lp";


export const getLpList = async (
  paginationDto: PaginationDto
): Promise<ResponseLpListDto> => {
  //구조분해할당
  const { data } = await axiosInstance.get("/v1/lps", { params: paginationDto });
  return data;
};
//  LP 상세 가져오기 
export const fetchLpDetail = async (lpid: string): Promise<ResponseLpListDto> => {
  const { data } = await axiosInstance.get(`/v1/lps/${lpid}`);
  return data;
};
