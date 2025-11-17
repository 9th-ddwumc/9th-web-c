import type { PAGINATION_ORDER } from "../enums/common";

export type CommonReponse<T> = {
     status:boolean;
     statusCode:number;
     message:string;
     data:T;
};

export type CursorBasedResponse<T> = CommonReponse<{
     data:T;
     nextCursor:number|null;
     hasNext:boolean;
}>;

//위 타입2가지를 합친거
// export type CusorBaseResponse<T> = {
//      status:boolean;
//      statusCode:number;
//      message:string;
//      data:{
//           data:T;
//           nextCursor:number;
//           hasNext:boolean;
//      }
// };

export type PaginationDto = {
     cursor?:number;
     limit?:number;
     search?:string;
     order?:PAGINATION_ORDER;
};