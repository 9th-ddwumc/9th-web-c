import type { CommonReponse } from "./common";

//회원가입
export type RequestSignupDto = {
    name: string;
    email:string;
    bio?: string;
    avatar?: string;
    password:string;

} 

export type ResponseSignupDto = CommonReponse<{
    id:number;
    name:string;
    email:string;
    bio:string | null;
    avatar: string| null;
    createdAt: Date;
    updatedAt: Date;
}>;

//로그인
export type RequestSigninDto = {
    email:string;
    password:string;
} 

export type ResponseSigninDto = CommonReponse<{
    id:number;
    name:string;
    accessToken:string;
    refreshToken:string;
}>;

/*
//내 정보 조회
export type ResponseMyInfoDto = CommonReponse<{
    id:number;
    name:string;
    email:string;
    bio:string | null;
    avatar: string| null;
    createdAt: Date;
    updatedAt: Date;
}>;
*/
/* API 응답 래퍼 타입 */
export interface ApiResponse<T> {
  status: boolean;
  statusCode: number;
  message: string;
  data: T;
}

// MyInfoData 타입 정의
export interface MyInfoData {
  id: number;
  name: string;
  email: string;
  bio: string | null;     
  avatar: string | null;  
  createdAt: string;
  updatedAt: string;
}

/** 내 정보 API 응답 타입  */
export interface ResponseMyInfoDto extends ApiResponse<MyInfoData> {}

//  프로필 수정시 API로 보낼 DTO
export interface RequestUpdateMyInfoDto {
  name: string;
  bio?: string | null;    
  avatar?: string | null;  
}


// 회원 탈퇴 API 응답 타입 추가
export type ResponseDeleteUserDto = ApiResponse<{
  message: string;
}>;