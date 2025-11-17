import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { postLogout } from "../apis/auth";
import useGetMyInfo from "../hooks/queries/useGetMyInfo";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const Navbar = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  const { accessToken, logout } = useAuth();

  //const [user, setUser] = useState<ResponseMyInfoDto | null>(null);
  const { data: user } = useGetMyInfo(accessToken);
  
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  /*
  useEffect(() => {
    const fetchData = async () => {
      if (accessToken) {
        const res = await getMyInfo();
        setUser(res);
        //console.log(res)
      }
    };
    fetchData();
  }, [accessToken]);
*/
    // 로그아웃 useMutation 구현
      const logoutMutation = useMutation({
        mutationFn: postLogout, // API 호출
        onSuccess: () => {
          //  AuthContext의 logout 함수를 호출해 토큰 제거
          logout();
          //  'myInfo' 쿼리 캐시를 즉시 제거하여 UI(Nav) 업데이트
          // (invalidateQueries(무효화)가 아님. 사용자가 없으므로 데이터를 새로 가져올 필요 X)
          // 이 코드로 인해 'user' 상태가 undefined가 되고 UI가 즉시 로그아웃 상태로 변경됨.
          queryClient.removeQueries({ queryKey: ["myInfo"] });
          
          alert("로그아웃 성공");
          navigate("/"); // 홈으로 이동
        },
        onError: (error) => {
          console.error("로그아웃 오류", error);
          alert("로그아웃 실패");
          //서버 요청이 실패하더라도, 클라이언트 측에서는 강제로 로그아웃 처리
          logout(); // AuthContext의 logout 함수 호출
          queryClient.removeQueries({ queryKey: ["myInfo"] });//캐시 제거
          navigate("/");
        }
      });

   

    const handleLogout = async () => {
      // await logout();
      // navigate("/");
      logoutMutation.mutate();
    };

  return (
    <div className="flex justify-between items-center px-5 py-3 h-15 bg-[#212121]">
      {/* Navbar 왼쪽 영역 (햄버거 메뉴 + 로고) */}
      <div className="flex items-center gap-4">
        {/* 햄버거 메뉴 버튼 (사이드바 토글) */}
        <button
          onClick={toggleSidebar}
          className="text-white text-3xl hover:cursor-pointer"
        >
          ≡
        </button>
        {/* 로고 (사이트 이름) 버튼 */}
        <button
          onClick={() => navigate("")}
          className="text-2xl font-bold text-pink-600 cursor-pointer "
        >
          돌려돌려돌림판
        </button>
      </div>

      {/*Navbar 오른쪽 영역 (검색 + 로그인/회원가입 또는 사용자 정보/로그아웃) */}
      <div className="flex gap-3">
        {/* 검색 버튼 */}
        <button className="py-2 hover:cursor-pointer">
          <img
            src="https://www.citypng.com/public/uploads/preview/white-search-icon-button-png-img-735811696240431a0p3ex0i2v.png"
            alt="검색"
            className="w-5 h-5 inline-block mr-2"
          />
        </button>

        {/* 조건부 렌더링: 로그아웃 상태일 때 */}
        {!accessToken && (
          <>
            <button
              onClick={() => navigate("login")}
              className="px-4 py-2 hover:bg-pink-500 text-white bg-gray-700 rounded-md cursor-pointer"
            >
              로그인
            </button>
            <button
              onClick={() => navigate("signup")}
              className="px-4 py-2 hover:bg-pink-500 text-white bg-gray-700 rounded-md cursor-pointer"
            >
              회원가입
            </button>
          </>
        )}

        {/* 조건부 렌더링: 로그인 상태일 때 */}
        {accessToken && (
          <>
            <p className="pt-2 pr-2 text-white">
              {/*
                'user?.data.name': 'user' 상태가 아직 'null'일 때(API 응답 전)
                에러가 발생하지 않도록 '?' (Optional Chaining)을 사용합니다.
              */}
              {user?.data.name}님 반갑습니다.
            </p>
            <button
              onClick={handleLogout}
              className="px-4 py-2 hover:bg-gray-500 text-white bg-[#212121] rounded-md cursor-pointer"
              disabled={logoutMutation.isPending} // 로그아웃 중 비활성화
            >
              {logoutMutation.isPending ? "로그아웃 중..." : "로그아웃"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;