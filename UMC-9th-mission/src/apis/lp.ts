import type { PagenationDto } from "../types/common";
import type { ResponseLpListDto, ResponseLpDetailDto, ResponseLikeLpDto, RequestLpDetailDto, RequestPostLpDto } from "../types/lp";
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

export const postLike = async({
  lpId,
}:RequestLpDetailDto):Promise<ResponseLikeLpDto> => {
  const {data} = await axiosInstance.post(`/v1/lps/${lpId}/likes`);

  return data;
}

export const deleteLike = async({lpId}:RequestLpDetailDto) => {
  const {data} = await axiosInstance.delete(`/v1/lps/${lpId}/likes`);
  return data;
}

export const postLp = async (lpData: RequestPostLpDto): Promise<ResponseLpDetailDto> => {
  const { data } = await axiosInstance.post("/v1/lps", lpData);
  return data;
}

export const deleteLp = async ({lpId}:RequestLpDetailDto) => {
  const {data} = await axiosInstance.delete(`/v1/lps/${lpId}`);
  return data;
}

export const patchLp = async (
  { lpId }: RequestLpDetailDto,
  lpData: RequestPostLpDto
): Promise<ResponseLpDetailDto> => {
  const { data } = await axiosInstance.patch(`/v1/lps/${lpId}`, lpData);
  return data;
};
