// hooks/mutations/usePostComment.ts
import { useMutation } from "@tanstack/react-query";
import { RequestPostCommentDto, ResponseCommentDto } from "../../types/comment";
import { queryClient } from "../../App"; // 혹은 queryClient 경로에 맞게
import { QUERY_KEY } from "../../constants/key";
import { postComment } from "../../apis/comment";

const usePostComment = () => {
  return useMutation<ResponseCommentDto, Error, RequestPostCommentDto>({
    mutationFn: (dto: RequestPostCommentDto) => postComment(dto),
    onSuccess: (data, variables) => {
      // 댓글 작성 후 해당 LP 댓글 목록 새로고침
      queryClient.invalidateQueries({queryKey:[QUERY_KEY.comments, variables.lpId], exact: false,});
    },
    onError: (err) => {
      console.error("댓글 작성 실패:", err);
      alert("댓글 작성에 실패했습니다.");
    },
  });
};

export default usePostComment;
