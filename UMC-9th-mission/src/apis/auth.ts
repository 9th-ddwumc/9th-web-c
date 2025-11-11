//코드 실행 시에는 포함되지 않고, TypeScript 타입 검사용으로만 사용됩니다.
import type { RequestSigninDto, RequestSignupDto, RequestUpdateMyInfoDto, ResponseDeleteUserDto, ResponseMyInfoDto, ResponseSigninDto, ResponseSignupDto } from "../types/auth"

import { axiosInstance } from "./axios";

//회원가입 API를 요청하는 비동기 함수(매개변수 body — 회원가입 폼에서 전달된 유저 정보)
export const postSignup = async (body:RequestSignupDto):Promise<ResponseSignupDto> => {
    const {data} = await axiosInstance.post(
        "/v1/auth/signup",
        body,
    );
    return data; //반환타입 ->비동기 함수가 ResponseSignupDto 형태의 데이터를 resolve한다는 뜻
};

export const postSignin = async (body:RequestSigninDto):Promise<ResponseSigninDto> => {
    const {data} = await axiosInstance.post(
        "/v1/auth/signin",
        body,
    );
    return data;
};

//보통 로그인된 사용자의 JWT 토큰을 통해 인증하고, 해당 유저의 내 정보(이메일, 닉네임 등) 를 반환
export const getMyInfo = async (): Promise<ResponseMyInfoDto>=>{
    const {data} = await axiosInstance.get("/v1/users/me");

    return data;
}

export const postLogout = async() => {
    const{data} = await axiosInstance.post("/v1/auth/signout");

    return data;
};

/* 내 정보 수정 API */
export const updateMyInfo = async (
  dto: RequestUpdateMyInfoDto
): Promise<ResponseMyInfoDto> => { // 수정 후, 수정된 내 정보를 반환한다고 가정
  const { data } = await axiosInstance.patch("/v1/users", dto);
  return data;
};

// 회원 탈퇴 API 함수 추가
export const deleteUser = async (): Promise<ResponseDeleteUserDto> => {
  const { data } = await axiosInstance.delete("/v1/users");
  return data;
};