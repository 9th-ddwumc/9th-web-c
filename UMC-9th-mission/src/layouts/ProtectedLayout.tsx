import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Navbar } from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { FloatingButton } from "../components/FloatingButton";
import { useEffect, useState } from "react";

const ProtectedLayout = () => { 
  
  const { accessToken } = useAuth();
  const location = useLocation();
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (!accessToken && location.state?.from === undefined) {
      // 사용자가 직접 URL로 접근했을 때만 alert
      setShowAlert(true);
    }
  }, [accessToken, location.state]);

  if (accessToken === undefined) return null;

  if (!accessToken) {
    if (showAlert) {
      alert("로그인이 필요한 서비스입니다. 로그인을 해주세요!");
      setShowAlert(false); // alert 한 번만 뜨도록
    }
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
    /*
    if (!accessToken) { 
        alert("로그인이 필요한 서비스입니다. 로그인을 해주세요!"); 
        return <Navigate to={"/login"} replace state={{from:location}}/>; 
    }*/
    /*
    const {accessToken} = useAuth(); 
    if (accessToken === undefined) return null; 
    if (!accessToken) { 
        alert("로그인이 필요한 서비스입니다. 로그인을 해주세요!"); 
        return <Navigate to={"/login"} replace />; 
    }
    */

    return (<div className="h-full flex flex-col bg-black">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-y-autopx-6 text-white">
          <Outlet />
          <FloatingButton />
        </main>
      </div>
    </div>);
};
 
 export default ProtectedLayout;