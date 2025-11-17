
/**댓글 작성자(author) 타입**/
export type CommentAuthor = {
  id: number;
  name: string;
  email: string;
  bio: string | null;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
};

/**개별 댓글(Comment) 타입*/
export type Comment = {
  id: number;
  content: string;
  lpId: number;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  author: CommentAuthor; // 댓글 작성자 정보
};

/**댓글 API 응답 페이지(CommentPage) 타입 */
export interface CommentPage {
  data: Comment[];        //실제 댓글 데이터 배열
  nextCursor: number;     // 
  hasNext: boolean;       // 다음 페이지 유무 (hasNextPage로 이름 변경 가능)
}

/*API 응답 래퍼 타입 */
export interface ApiResponse<T> {
  status: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export interface RequestCreateCommentDto {
  lpId: number;
  content: string;
}