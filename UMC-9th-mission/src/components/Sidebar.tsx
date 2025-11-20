import { Link } from "react-router-dom";
import { Search, User } from "lucide-react";
import UnsubscribeModal from "./UnsubscribeModal";
import { useAuth } from "../context/AuthContext";
import useSidebar from "../hooks/useSidebar";
import { useEffect, useState } from "react";

const Sidebar = () => {
  const { accessToken } = useAuth();
  const { isOpen, close, toggle } = useSidebar();
  const [showModal, setShowModal] = useState(false);

  // ESC 키로 Sidebar 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [close]);

   // 배경 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleUnsubscribeClick = () => {
    if (accessToken) {
      setShowModal(true);
    } else {
      alert("로그인 후 이용할 수 있습니다.");
    }
  };

  return (
    <>
      {/* 햄버거 버튼 */}
      <button
        className="fixed top-4 left-4 z-50 text-white lg:hidden"
        onClick={toggle}
      >
        <svg width="32" height="32" viewBox="0 0 48 48">
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

      {/* Sidebar */}
      <aside
        className={`
          bg-[#1f1f1f] h-screen w-64
          fixed lg:sticky top-0 left-0
          flex flex-col justify-between
          transition-transform duration-300 ease-in-out
          z-40
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* 상단 메뉴 */}
        <div className="p-6 pt-20 text-white space-y-2">
          <Link
            to="#"
            onClick={close}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 transition"
          >
            <Search className="w-5 h-5" />
            <span>찾기</span>
          </Link>

          <Link
            to="/my"
            onClick={close}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 transition"
          >
            <User className="w-5 h-5" />
            <span>마이페이지</span>
          </Link>
        </div>

        {/* 하단 고정 영역 */}
        <div className="p-6 border-t border-gray-800">
          <button
            onClick={handleUnsubscribeClick}
            className="w-full text-red-400 hover:text-red-500 hover:bg-gray-800 py-3 rounded-lg transition text-sm"
          >
            탈퇴하기
          </button>
        </div>
      </aside>

      {/* 모바일 배경 오버레이 */}
      {isOpen && (
        <div
          className="fixed inset-0 lg:hidden bg-black/70 z-30"
          onClick={close}
        />
      )}

      {/* 탈퇴 모달 */}
      {showModal && <UnsubscribeModal onClose={() => setShowModal(false)} />}
    </>
  );
};

export default Sidebar;
