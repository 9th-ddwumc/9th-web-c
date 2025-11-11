import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import FloatingMenu from "../components/FloatingMenu";

const HomeLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const closeSidebar = () => {
    if (isSidebarOpen) setIsSidebarOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768 && isSidebarOpen) setIsSidebarOpen(false);
    };

    window.addEventListener("resize", handleResize);

    //추가했던 'resize' 이벤트 리스너를 제거합니다. (메모리 누수 방지)
    return () => window.removeEventListener("resize", handleResize);
  }, [isSidebarOpen]);

  return (
    <div className="min-h-screen flex flex-col bg-[#000000]">
      <Navbar toggleSidebar={toggleSidebar} />

      {/* 20. 모바일용 'Dim' 배경 (조건부 렌더링) */}
      {isSidebarOpen && window.innerWidth < 768 && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
        />
      )}

      {/* 23. 메인 콘텐츠 영역 (사이드바 + 실제 페이지) */}
      <div className="relative flex flex-row flex-1">
        {/* 24. 사이드바 (조건부 렌더링) */}
        {isSidebarOpen && (
          <div className="fixed top-0 left-0 z-50 md:static h-full">
            <Sidebar />
          </div>
        )}
        {/* 27. 실제 페이지 콘텐츠가 표시될 <main> 태그 */}
        <main
          onClick={closeSidebar}
          className="flex-1 relative z-10 mt-10 text-pink-600 px-4"
        >
          
          <Outlet />
          <FloatingMenu />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default HomeLayout;
