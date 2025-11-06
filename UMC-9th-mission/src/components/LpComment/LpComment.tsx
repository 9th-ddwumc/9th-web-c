import type { Comment } from "../../types/comment"; 

interface LpCommentProps {
  comment: Comment;
}

const LpComment = ({ comment }: LpCommentProps) => {
  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow">
      <div className="flex items-center space-x-3">
        {/* 작성자 아바타 */}
        <img
          src={comment.author.avatar || "/default-avatar.png"} // 기본 아바타
          alt={comment.author.name}
          className="w-10 h-10 rounded-full bg-gray-600 object-cover"
        />
        <div className="flex-1">
          {/* 작성자 이름 */}
          <p className="font-semibold text-white">{comment.author.name}</p>
          {/* 댓글 작성일 */}
          <p className="text-sm text-gray-400">
            {new Date(comment.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      {/* 댓글 내용 */}
      <p className="mt-3 text-gray-200 whitespace-pre-line">
        {comment.content}
      </p>
    </div>
  );
};

export default LpComment;