import { Navigate, Outlet, useLocation } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import useSidebar from "../hooks/useSidebar";

const ProtectedLayout = () => {
  const { isOpen: isSidebarOpen, open: openSidebar, close: closeSidebar } = useSidebar();
  const { accessToken } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) closeSidebar();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!accessToken) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return (
    <div className='h-dvh flex flex-col bg-black'>
      <Navbar onMenuClick={openSidebar}/>
      <div className='flex flex-1 overflow-hidden'>
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
        <main className='flex-1 overflow-y-auto'>
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default ProtectedLayout;