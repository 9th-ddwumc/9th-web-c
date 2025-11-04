import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const ProtectedLayout = () => {
  const { accessToken } = useAuth();

  if (!accessToken) {
    return <Navigate to={"/login"} replace />;
  }

  return (
    <div className='h-dvh flex flex-col bg-black'>
      <Navbar />
      <div className='flex flex-1 overflow-hidden'>
        <Sidebar/>
        <main className='flex-1 overflow-y-auto'>
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default ProtectedLayout;