import type { PagenationDto } from "../types/common";
import type { ResponseLpListDto, ResponseLpDetailDto } from "../types/lp";
import { axiosInstance } from "./axios";

export const getLpList = async (
  pagenationDto: PagenationDto
): Promise<ResponseLpListDto> => {
  console.log("📤 요청 params:", pagenationDto);
  const { data } = await axiosInstance.get("/v1/lps", {
    params: pagenationDto,
  });
  console.log("📥 응답 데이터:", data);
  return data;
};

// ✅ 단일 LP 상세 조회
export const getLpDetail = async (lpid: number): Promise<ResponseLpDetailDto> => {
  console.log("📤 LP 상세 요청:", lpid);
  const { data } = await axiosInstance.get(`/v1/lps/${lpid}`);
  console.log("📥 LP 상세 응답:", data);
  return data;
};
