import { Link } from "react-router-dom";
import { Search, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../apis/axios";
import DeleteUserModal from "./DeleteUserModal";
import { useAuth } from "../context/AuthContext";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { accessToken } = useAuth();

  // ESC 키 눌러서 Sidebar 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    };

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    }
  })

  const deleteMutate = useMutation({
    mutationFn: async () => {
      await axiosInstance.delete("/v1/users");
    },
    onSuccess: () => {
      localStorage.clear();
      alert("탈퇴가 완료되었습니다.");
      setIsModalOpen(false);
      window.location.href = '/login';
    },
    onError: (error) => {
      console.error('탈퇴 실패:', error);
      alert("탈퇴 중 오류가 발생했습니다.");
    }
  });

  const handleDeleteConfirm = () => {
    deleteMutate.mutate();
  };

  return (
    <>
        {/* 작은 화면 오버레이 */}
        {isOpen && (
          <div 
            className='fixed inset-0 bg-black/50 z-30 md:hidden'
            onClick={onClose}
          />
        )}

        {/* 사이드바 */}
        <aside className={`
          fixed md:static
          top-16
          left-0 bottom-0
          w-50
          bg-black border-r border-gray-800
          flex flex-col p-4
          transition-transform duration-300 ease-in-out
          z-40
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
        <nav className='space-y-4 mt-3 md:mt-1'>
          <Link 
            to="/" 
            onClick={onClose}
            className='flex items-center gap-3 text-sm text-white hover:text-gray-300'
          >
            <Search size={16} />
            <span>찾기</span>
          </Link>
          
          <Link 
            to="/mypage" 
            onClick={onClose}
            className='flex items-center gap-3 text-sm text-white hover:text-gray-300'
          >
            <User size={16} />
            <span>마이페이지</span>
          </Link>
        </nav>
        
        {accessToken && (
          <div className='mt-auto flex items-center justify-center'>
            <button
              onClick={() => setIsModalOpen(true)}
              className='py-2 px-4 text-xs text-white hover:text-gray-300 transition-colors'>
              탈퇴하기
            </button>
          </div>
        )}
      </aside>

      {/* 탈퇴 모달 */}
      <DeleteUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
};

export default Sidebar;