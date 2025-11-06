import type { PAGENATION_ORDER } from "../enums/common";

export type CommonResponse<T> = {
    status: boolean;
    statusCode: number;
    message: string;
    data: T
}

export type CursorBasedResponse<T> = CommonResponse<{
    data: T;
    nextCursor: number|null;
    hasNext: boolean;
}>

export type PagenationDto = {
    cursor?: number;
    limit?: number;
    search?: string;
    order?: PAGENATION_ORDER;
}
