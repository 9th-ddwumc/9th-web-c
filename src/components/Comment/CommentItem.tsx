import type { LpComment } from "../../types/lpComment";

interface CommentItemProps {
  comment: LpComment;  // Comment -> LpComment
}

function CommentItem({ comment }: CommentItemProps) {
  return (
    <div className="flex gap-3">
      {/* 아바타 */}
      <div className="w-10 h-10 rounded-full bg-pink-600 flex items-center justify-center flex-shrink-0">
        {comment.author.avatar ? (
          <img
            src={comment.author.avatar}
            alt={comment.author.name}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <span className="text-white font-bold text-sm">
            {comment.author.name.charAt(0)}
          </span>
        )}
      </div>

      {/* 댓글 내용 */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="font-semibold text-white">{comment.author.name}</span>
          <button className="text-gray-500 hover:text-gray-400">
            ⋮
          </button>
        </div>
        <p className="text-gray-300 mb-1">{comment.content}</p>
        <span className="text-xs text-gray-500">
          {new Date(comment.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}

export default CommentItem;