import { Link } from "react-router-dom";
import { useState } from "react";
import { Search, User } from "lucide-react";
import UnsubscribeModal from "./UnsubscribeModal";
import { useAuth } from "../context/AuthContext"; // AuthContext 임포트

const Sidebar = () => {
  const { accessToken } = useAuth(); // 로그인 상태
  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleUnsubscribeClick = () => {
    if (accessToken) {
      setShowModal(true); // 로그인 상태면 모달 열기
    } else {
      alert("로그인 후 이용할 수 있습니다.");
    }
  };

  return (
    <>
      {/* ☰ 햄버거 버튼 */}
      <button
        className="fixed top-4 left-4 z-[9999] text-white text-2xl"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 48 48"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="4"
            d="M7.95 11.95h32m-32 12h32m-32 12h32"
          />
        </svg>
      </button>

      {/* 사이드바 */}
      <div
        className={`bg-[#1f1f1f] h-screen fixed lg:static 
          lg:sticky top-0 left-0 pt-15
          flex flex-col justify-between transform transition-transform duration-300 z-40 will-change-transform
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-60 w-0"}
          overflow-hidden`}
      >
        {/* 상단 메뉴 */}
        <div className="p-10 text-white space-y-4">
          <Link
            to="#"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded"
          >
            <Search className="w-5 h-5" />
            찾기
          </Link>
          <Link
            to="/my"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded"
          >
            <User className="w-5 h-5" />
            마이페이지
          </Link>
        </div>

        {/* 하단 고정 */}
        <div className="flex justify-center mb-2 p-4">
          <button
            onClick={handleUnsubscribeClick}
            className="text-red-400 hover:text-red-500"
          >
            탈퇴하기
          </button>
        </div>
      </div>

      {/* 배경 오버레이 (모바일에서만 보임) */}
      {isOpen && (
        <div
          className="fixed inset-0 lg:hidden bg-black bg-opacity-70"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* 탈퇴 모달 */}
      {showModal && <UnsubscribeModal onClose={() => setShowModal(false)} />}
    </>
  );
};

export default Sidebar;