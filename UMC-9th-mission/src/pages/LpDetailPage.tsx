import { useLocation, useNavigate, useParams } from "react-router-dom";
import LpListFallback from "../components/LpListFallback"; // 로딩/에러 공용 컴포넌트
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { PAGINATION_ORDER } from "../enums/common";
import CommentList from "../components/LpComment/CommentList";
import useGetLpDetail from "../hooks/queries/useGetLpDetail";
import useGetMyInfo from "../hooks/queries/useGetMyInfo";
import { Heart, Settings, Trash2 } from 'lucide-react';
import usePostLike from "../hooks/mutations/usePostLike";
import useDeleteLike from "../hooks/mutations/useDeleteLike";
import { useMutation } from "@tanstack/react-query";
import type { RequestUpdateLpDto} from "../types/lp";
import { queryClient } from "../App";
import { deleteLp, updateLp } from "../apis/lp";
import { QUERY_KEY } from "../constants/key";

//LP 상세 페이지 컴포넌트
const LpDetailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {lpId} = useParams();
  const {accessToken} = useAuth();

   // [데이터] 1. LP 상세 정보 가져오기 (React Query 커스텀 훅)
  const{
    data:lp, 
    isPending, 
    isError
  } = useGetLpDetail({lpId:Number(lpId)})
  // [데이터] 2. 현재 로그인한 '내 정보' 가져오기 (React Query 커스텀 훅)
  const {data:me} = useGetMyInfo(accessToken);

  // 현재 유저가 작성자인지 확인
  const isAuthor = me?.data.id === lp?.data.authorId;

  //mutate -> 비동기 요청을 실행하고, 콜백 함수를 이용해서 후속 작업 처리함
  //mutateAsync -> Promise를 반혼해서 await 사용 가능
  const{mutate: likeMutate, mutateAsync} = usePostLike();
  const{mutate: disLikeMutate} = useDeleteLike();

  //댓글 표시/숨김 상태 (기본값: false)
  const [isCommentVisible, setIsCommentVisible] = useState(false);

  // 댓글 정렬 상태 (기본: 최신순)
  const [commentOrder, setCommentOrder] = useState<PAGINATION_ORDER>(
    PAGINATION_ORDER.desc
  );

  // 비로그인 접근 시 경고 모달 띄우기
  useEffect(() => {
    if (!accessToken) {
      const confirmLogin = window.confirm("로그인이 필요합니다. 로그인하시겠습니까?");
      //사용자가 '확인'을 누르면
      if (confirmLogin) {
        navigate("/login", { state: { from: location.pathname } }); // 로그인 후 돌아올 경로 저장
      } else {
        navigate("/");
      }
    }
  }, [accessToken, navigate, location]);

  // 수정 모달 상태
  const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");

  // 삭제 확인 모달 상태
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // LP 수정 Mutation
  const updateLpMutation = useMutation({
    mutationFn: (dto: RequestUpdateLpDto) => updateLp({ lpId: Number(lpId), dto }),
    onSuccess: () => {
       alert("LP가 수정되었습니다.");
      queryClient.invalidateQueries({ 
        queryKey: [QUERY_KEY.lps, Number(lpId)]
      });
      setIsModifyModalOpen(false);
        },
    onError: (err) => { console.error("LP 수정 실패:", err); alert("LP 수정에 실패했습니다."); },
  });

  // LP 삭제 Mutation
  const deleteLpMutation = useMutation({
    mutationFn: () => deleteLp({ lpId: Number(lpId) }),
    onSuccess: () => {
      alert("LP가 삭제되었습니다.");
      queryClient.invalidateQueries({ queryKey: ['lpList'] }); // 목록 새로고침
      navigate('/'); // 홈으로 이동
    },
    onError: (err) => { console.error("LP 삭제 실패:", err); alert("LP 삭제에 실패했습니다."); },
  });

  // 수정 모달 열기 핸들러
  const openModifyModal = () => {
    if (lp?.data) {
      // 모달을 열 때, 현재 LP 데이터로 폼 내용을 미리 채움
      setEditedTitle(lp.data.title);
      setEditedContent(lp.data.content);
      setIsModifyModalOpen(true);
    }
  };

  // LP 수정 제출 핸들러
  const handleModifySubmit = (e: React.FormEvent) => {
    e.preventDefault(); // 폼 기본 동작(새로고침) 방지
    const title = editedTitle.trim();
    const content = editedContent.trim();
    if (!title || !content) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }
    updateLpMutation.mutate({ title, content });
  };
  
  // LP 삭제 핸들러
  const handleDeleteLp = () => {
    deleteLpMutation.mutate();
    setIsDeleteModalOpen(false);
  };
  
  if (isPending) return <LpListFallback type="loading" />;
  if (isError) return <LpListFallback type="error" />;

  // lpid가 없을 경우 안전하게 분기
  if (!lpId) {
    return <LpListFallback type="error" message="잘못된 접근입니다." />;
  }
  
  // 로그인 안 되어 있으면 내용 표시 안 함
  if (!accessToken) return null;
   
  /*
  const isLiked = lp?.data.likes
  .map((like) => like.userId)
  .includes(me?.data.id as number);
  */
  //위 코드보다 속도 빠름
  const isLiked = lp?.data.likes.some((like) => like.userId === me?.data.id);

  const handleLikeLp = () => {
    me?.data.id && likeMutate({lpId:Number(lpId)});
  };

  const handleDislikeLp = () => {
    disLikeMutate({lpId:Number(lpId)});
  }
  //console.log(me)
  
  return(
    <>
    <div className="max-w-4xl mx-auto p-4 space-y-6 text-white">

        {/* 썸네일 */}
      <img
        src={lp?.data.thumbnail}
        alt={lp?.data.title}
        className="w-full h-80 object-cover rounded-lg shadow-lg"
      />

      {/* 제목 + 메타 정보 */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{lp?.data.title}</h1>
          <div className="text-gray-400 text-sm">
          {new Date(lp?.data.createdAt).toLocaleDateString()} · {lp?.data.likes.length} ♥️
       </div>
     </div>

      {/* 본문 */}
      <div className="prose prose-invert text-gray-200 whitespace-pre-line">
        {lp?.data.content}
      </div>

     {/* 버튼 */}
      <div className="flex space-x-3 mt-4">
        {/*  작성자일 경우에만 버튼 노출 */}
        {isAuthor && (
            <div className="flex space-x-3 ml-auto">
              <button 
                onClick={openModifyModal}
                className="flex items-center gap-1 px-4 py-2 bg-gray-600 rounded hover:bg-gray-700 transition"
              >
                <Settings size={16} /> 수정
              </button>
              <button 
                onClick={() => setIsDeleteModalOpen(true)}
                className="flex items-center gap-1 px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition"
              >
                <Trash2 size={16} /> 삭제
              </button>
            </div>
          )}

        <button onClick={isLiked ?  handleDislikeLp : handleLikeLp }>
          <Heart 
            color = {isLiked ? "red" : "white"} 
            fill = {isLiked? "red" : "transparent"}
          />
        </button>
       </div>

      {/* ========== 댓글 섹션 ========== */}
      {/*댓글 토글 버튼 */}
        <div className="mt-12 border-t border-gray-700 pt-6">
          <button 
            onClick={() => setIsCommentVisible(!isCommentVisible)}
            className="text-xl font-semibold mb-4 text-white hover:text-pink-400 transition"
          >
            댓글 {isCommentVisible ? "숨기기 🔼" : "보기 🔽"}
          </button>

          {/*isCommentVisible이 true일 때만 댓글 영역을 렌더링 */}
          {isCommentVisible && (
            <div className="mt-4">
              {/* 정렬 버튼 */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setCommentOrder(PAGINATION_ORDER.desc)}
                  className={`px-3 py-1 rounded ${
                  commentOrder === PAGINATION_ORDER.desc ? "bg-pink-600 text-white" : "bg-gray-700 text-gray-300"}`}
                >
                최신순
                </button>
                <button
                  onClick={() => setCommentOrder(PAGINATION_ORDER.asc)}
                  className={`px-3 py-1 rounded ${
                  commentOrder === PAGINATION_ORDER.asc ? "bg-pink-600 text-white" : "bg-gray-700 text-gray-300"}`}
                >
                오래된순
                </button>
              </div>

              {/*댓글 리스트 컴포넌트 */}
              <CommentList lpid={lpId} order={commentOrder} />
            </div>
          )}
        </div>
    </div>
    {/*  LP 수정 모달 */}
      {isModifyModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
             onClick={() => setIsModifyModalOpen(false)}>
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-lg text-white" 
               onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4">LP 수정</h2>
            <form onSubmit={handleModifySubmit} className="space-y-4">
              <div>
                <label htmlFor="lp-title" className="block text-sm font-medium text-gray-300">LP 이름 (필수)</label>
                <input
                  id="lp-title"
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="lp-content" className="block text-sm font-medium text-gray-300">LP 내용 (필수)</label>
                <textarea
                  id="lp-content"
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  rows={6}
                  className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 rounded-md text-white resize-none focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModifyModalOpen(false)}
                  className="px-4 py-2 bg-gray-600 rounded-md hover:bg-gray-500 transition-colors"
                  disabled={updateLpMutation.isPending}
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-pink-600 rounded-md hover:bg-pink-700 transition-colors disabled:bg-gray-500"
                  disabled={updateLpMutation.isPending}
                >
                  {updateLpMutation.isPending ? "저장 중..." : "저장"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/*  LP 삭제 확인 모달 */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
             onClick={() => setIsDeleteModalOpen(false)}>
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-sm text-white" 
               onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4">LP 삭제</h2>
            <p className="text-gray-300 mb-6">
              정말로 이 LP를 삭제하시겠습니까? <br />
              이 작업은 되돌릴 수 없습니다.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-gray-600 rounded-md hover:bg-gray-500 transition-colors"
                disabled={deleteLpMutation.isPending}
              >
                아니오
              </button>
              <button
                type="button"
                onClick={handleDeleteLp}
                className="px-4 py-2 bg-red-600 rounded-md hover:bg-red-700 transition-colors disabled:bg-red-800"
                disabled={deleteLpMutation.isPending}
              >
                {deleteLpMutation.isPending ? "삭제 중..." : "예"}
              </button>
            </div>
          </div>
        </div>
      )}
      </>
  );
  
};

export default LpDetailPage;