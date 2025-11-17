import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import { useState, useEffect } from "react";

const ProtectedLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { accessToken } = useAuth();

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    if (isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768 && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isSidebarOpen]);

  //--- 핵심: 인증 확인(Guard) 로직 ---
  if (!accessToken) {
  return <Navigate to={`/login?from=${location.pathname}`} replace />;
}
  // --- 인증 성공 시 렌더링될 UI ---
  return (
    <div className="min-h-screen flex flex-col bg-[#161616]">
      {/* 모바일용 Dim 배경 (HomeLayout과 동일) */}
      {isSidebarOpen && window.innerWidth < 768 && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
        />
      )}

      {/* 메인 콘텐츠 영역 (사이드바 + 실제 페이지) (HomeLayout과 동일) */}
      <div className="relative flex flex-row flex-1">
        {/* 사이드바 (조건부 렌더링) (HomeLayout과 동일) */}
        {isSidebarOpen && (
          <div className="fixed top-0 left-0 z-50 md:static h-full">
            <Sidebar />
          </div>
        )}
        {/*실제 자식 페이지가 렌더링될 <main> 영역 */}
        <main
          onClick={closeSidebar}
          className="flex-1 relative z-10 text-pink-600"
        >
          {/*<Outlet />: 이 자리에 ProtectedLayout으로 감싸진 
               자식 페이지(예: <MyPage />)가 렌더링*/}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ProtectedLayout;