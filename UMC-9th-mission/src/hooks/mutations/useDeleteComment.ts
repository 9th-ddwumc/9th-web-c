import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../App";
import { deleteComment } from "../../apis/comment";
import { QUERY_KEY } from "../../constants/key";

const useDeleteComment = () => {
    return useMutation({
    mutationFn: deleteComment,
    onSuccess: (_, variables) => {
      // 댓글 작성 후 해당 LP 댓글 목록 새로고침
      queryClient.invalidateQueries({queryKey:[QUERY_KEY.comments, variables.lpId], exact: false,});
    },
    onError: (err) => {
        console.error("댓글 삭제에 실패했습니다.")
    },
  });
}

export default useDeleteComment;