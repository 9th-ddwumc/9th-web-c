import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteComment } from '../../apis/comment';
import type { DeleteCommentDto } from '../../types/lpComment';

const useDeleteComment = (lpId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: DeleteCommentDto) => deleteComment({ lpId, id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ["lpComments", lpId] 
      });
    },
  });
};

export default useDeleteComment;