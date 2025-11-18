import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createComment } from '../../apis/comment';
import type { CreateCommentDto } from '../../types/lpComment';

const useCreateComment = (lpId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCommentDto) => createComment(data),
    onSuccess: () => {
      // 댓글 목록 쿼리 무효화하여 새로고침
      queryClient.invalidateQueries({ 
        queryKey: ["lpComments", lpId] 
      });
    },
  });
};

export default useCreateComment;