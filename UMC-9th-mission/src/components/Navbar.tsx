import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import type { ResponseMyInfoDto } from "../types/auth";
import { getMyInfo } from "../apis/auth";


export const Navbar = () => {
  const navigate = useNavigate();
  const { accessToken, logout } = useAuth();
  const [username, setUsername] = useState<string | null>(null);

  // accessToken이 있을 때만 사용자 정보 가져오기
  useEffect(() => {
    if (!accessToken) return;

    const fetchUserInfo = async () => {
      try {
        const res: ResponseMyInfoDto = await getMyInfo();
        setUsername(res.data.name); // username 세팅
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    };

    fetchUserInfo();
  }, [accessToken]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="fixed w-full flex items-center p-2 pt-4 bg-[#1f1f1f] z-50">
      <h1 onClick={() => navigate("/")}
      className="fixed pl-12 text-[#ed2463] font-bold cursor-pointer">돌려돌려LP판</h1>
      <div className="flex gap-2 ml-auto">
        <Link
          to="/search"
          className="flex items-center text-white p-1 rounded-sm hover:text-gray-200"
        >
          <Search className="w-6 h-6" />
        </Link>

        {/* 로그인 상태에 따른 렌더링 */}
        {accessToken && username && (
          <p className="text-white pt-0.5 pr-2">{username}님 반갑습니다.</p>
        )}

        {!accessToken && (
          <>
            <button
              onClick={() => navigate("/login")}
              className="text-white bg-black p-1 px-3 rounded-sm hover:font-bold"
            >
              로그인
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="text-white bg-[#ed2463] p-1 px-3 rounded-sm hover:font-bold"
            >
              회원가입
            </button>
          </>
        )}

        {accessToken && (
          <button
            onClick={handleLogout}
            className="text-white bg-black p-1 px-3 rounded-sm hover:font-bold"
          >
            로그아웃
          </button>
        )}
      </div>
    </nav>
  );
};
