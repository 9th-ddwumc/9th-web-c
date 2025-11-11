import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { deleteUser } from "../apis/auth";

//웹사이트의 사이드바(측면 메뉴) UI를 렌더링하는 컴포넌트
const Sidebar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const queryClient = useQueryClient();

  //  탈퇴 확인 모달 상태
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  //  회원 탈퇴 useMutation 구현
  const deleteUserMutation = useMutation({
    mutationFn: deleteUser, // API 호출
    onSuccess: () => {
      alert("회원 탈퇴가 완료되었습니다.");
      //  AuthContext의 logout 함수를 호출해 토큰 제거
      logout();
      //  'myInfo' 쿼리 캐시 제거
      queryClient.removeQueries({ queryKey: ["myInfo"] });

      setIsDeleteModalOpen(false); // 모달 닫기
      navigate("/login"); // 탈퇴 시 로그인 페이지로
    },
    onError: (error) => {
      console.error("회원 탈퇴 오류", error);
      alert("회원 탈퇴에 실패했습니다.");
      setIsDeleteModalOpen(false); // 모달 닫기
    },
  });

  //'예'를 누른 경우
  const handleDeleteUser = () => {
    deleteUserMutation.mutate();
  };

  return (
    <>
    <div className="w-60 h-[calc(100vh-64px)] bg-[#212121] text-white p-4 shadow-lg flex flex-col items-start">
      
      {/* '찾기' 버튼 */}
      <button className="mb-4 hover:text-gray-500 hover:cursor-pointer">
        <img
          src="https://www.citypng.com/public/uploads/preview/white-search-icon-button-png-img-735811696240431a0p3ex0i2v.png"
          alt="검색"
          className="w-5 h-5 inline-block mr-2"
        />
        찾기
      </button>

      {/*  '마이페이지' 버튼 */}
      <button
        onClick={() => navigate("my")}
        className="mb-4 hover:text-gray-500 hover:cursor-pointer"
      >
        <img
          src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
          alt="마이페이지"
          className="w-5 h-5 inline-block mr-2"
        />
        마이페이지
      </button>

      {/* '탈퇴하기' 버튼 추가 */}
        <button
          onClick={() => setIsDeleteModalOpen(true)} // 모달 열기
          className="mt-auto text-red-500 hover:text-red-400 hover:cursor-pointer"
          disabled={deleteUserMutation.isPending}
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/1214/1214428.png" 
            alt="탈퇴하기"
            className="w-5 h-5 inline-block mr-2"
          />
          탈퇴하기
        </button>
      </div>

      {/*  회원 탈퇴 확인 모달 */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-sm">
            <h2 className="text-xl font-bold text-white mb-4">회원 탈퇴</h2>
            <p className="text-gray-300 mb-6">
              정말로 탈퇴하시겠습니까? <br />
              모든 데이터가 영구적으로 삭제됩니다.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition-colors"
                disabled={deleteUserMutation.isPending}
              >
                아니오
              </button>
              <button
                type="button"
                onClick={handleDeleteUser} 
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:bg-red-800"
                disabled={deleteUserMutation.isPending}
              >
                {deleteUserMutation.isPending ? "탈퇴 중..." : "예"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;