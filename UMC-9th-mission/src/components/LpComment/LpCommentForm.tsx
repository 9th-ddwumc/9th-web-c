import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import useGetMyInfo from "../../hooks/queries/useGetMyInfo";
import { postComment } from "../../apis/lp";



interface LpCommentFormProps {
  lpId: string; // 부모(CommentList)로부터 lpId를 받는다.
}

//댓글 작성 폼을 렌더링하는 UI 컴포넌트
const LpCommentForm = ({ lpId }: LpCommentFormProps) => {
  const [content, setContent] = useState("");
  const hasError = content.length > 0 && content.length < 5;
  const errorMessage = "댓글은 5자 이상 입력해야 합니다. (디자인 예시)";

   // queryClient 인스턴스를 가져옵니다.
  const queryClient = useQueryClient();
  const { accessToken } = useAuth();
  const { data: me } = useGetMyInfo(accessToken); // 닉네임 표시용

  //  댓글 생성을 위한 useMutation 훅 
  const createCommentMutation = useMutation({
    mutationFn: (commentText: string) =>
      postComment({ lpId: Number(lpId), content: commentText }),

    onSuccess: () => {
      //  댓글 생성 성공 시
      // ['comments', lpId] 쿼리 키를 무효화하여 댓글 목록을 새로고침합니다.
      queryClient.invalidateQueries({ queryKey: ["lpComments", lpId] });
      setContent(""); // 입력창 비우기
    },
    onError: (err) => {
      console.error("댓글 작성 실패:", err);
      // alert("댓글 작성에 실패했습니다."); // iframe 환경에서는 alert 지양
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const commentToSubmit = content.trim();
    // 7 유효성 검사 및 뮤테이션 실행
    if (!commentToSubmit || hasError) {
      // alert("댓글 내용을 5자 이상 입력해주세요.");
      return;
    }
    createCommentMutation.mutate(commentToSubmit);
  };

  return (
    <form className="space-y-3 p-4 bg-gray-800 rounded-lg" onSubmit={handleSubmit}>
      {/*입력 필드 */}
      <textarea
        rows={3}
        placeholder="따뜻한 댓글을 남겨주세요... "
        className={`w-full p-3 bg-gray-700 border ${
          hasError ? "border-red-500" : "border-gray-600"
        } rounded-md text-white resize-none focus:outline-none focus:ring-2 focus:ring-pink-500`}
        value={content}
        //사용자가 textarea에 무언가를 입력할 때마다('onChange') 실행
        //이벤트(e) 객체에서 입력된 값(e.target.value)을 가져와
        //'setContent' 함수를 호출하여 'content' 상태를 업데이트
        onChange={(e) => setContent(e.target.value)}
        // 전송 중 비활성화
        disabled={createCommentMutation.isPending}
      />
      
      {/*유효성 안내 UI */}
      {hasError && <p className="text-red-500 text-sm">{errorMessage}</p>}
      
      {/*3. 버튼 */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-5 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition"
          disabled={createCommentMutation.isPending || hasError || !content.trim()} // 전송 중 또는 에러 시 비활성화
        >
          {createCommentMutation.isPending ? "등록 중..." : "등록"}
        </button>
      </div>
    </form>
  );
};

export default LpCommentForm;