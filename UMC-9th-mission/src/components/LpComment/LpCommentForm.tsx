import { useState } from "react";

const LpCommentForm = () => {
  const [content, setContent] = useState("");
  const hasError = content.length > 0 && content.length < 5;
  const errorMessage = "댓글은 5자 이상 입력해야 합니다. (디자인 예시)";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("댓글 작성 UI 테스트. 실제 전송 로직은 없습니다.");
  };

  return (
    <form className="space-y-3 p-4 bg-gray-800 rounded-lg" onSubmit={handleSubmit}>
      {/*입력 필드 */}
      <textarea
        rows={3}
        placeholder="따뜻한 댓글을 남겨주세요... (기능 미구현)"
        className={`w-full p-3 bg-gray-700 border ${
          hasError ? "border-red-500" : "border-gray-600"
        } rounded-md text-white resize-none focus:outline-none focus:ring-2 focus:ring-pink-500`}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      
      {/*유효성 안내 UI */}
      {hasError && <p className="text-red-500 text-sm">{errorMessage}</p>}
      
      {/*3. 버튼 */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-5 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition"
        >
          등록
        </button>
      </div>
    </form>
  );
};

export default LpCommentForm;