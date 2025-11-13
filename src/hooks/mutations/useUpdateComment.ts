import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateComment } from '../../apis/comment';
import type { UpdateCommentDto } from '../../types/lpComment';

const useUpdateComment = (lpId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateCommentDto) => updateComment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ["lpComments", lpId] 
      });
    },
  });
};

export default useUpdateComment;