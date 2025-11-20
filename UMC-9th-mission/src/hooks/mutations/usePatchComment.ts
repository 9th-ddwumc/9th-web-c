import { useMutation } from "@tanstack/react-query";
import { patchComment } from "../../apis/comment";
import { QUERY_KEY } from "../../constants/key";
import { queryClient } from "../../App";

const usePatchComment = () => {
    return useMutation({
    mutationFn: patchComment,
    onSuccess: (data, variables) => {
      // 댓글 작성 후 해당 LP 댓글 목록 새로고침
      queryClient.invalidateQueries({queryKey:[QUERY_KEY.comments, variables.lpId], exact: false,});
    },
    onError: (err) => {
      console.error("댓글 수정 실패:", err);
      alert("댓글 수정에 실패했습니다.");
    },
  });
}

export default usePatchComment;