import { useState } from "react";
import type { Lp } from "../../types/lp";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// LpCard 컴포넌트가 받을 props의 타입을 정의하는 TypeScript 인터페이스
interface LpCardProps{
  lp:Lp;
}

//개별 LP 정보를 표시하는 카드 UI 컴포넌트
const LpCard = ({ lp }: LpCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const { accessToken } = useAuth();

  const cardClick = () => {
    if (!accessToken) {
      const confirmed = window.confirm(
        "로그인이 필요한 서비스입니다. 로그인을 해주세요!"
      );
      if (confirmed) {
        // "돌아갈 경로" state에 원래 가려던 상세 페이지 경로를 저장
        // 로그인 페이지는 이 'state.from' 값을 보고, 로그인 성공 시 해당 경로로 다시 리다이렉트 시켜줌
        navigate("/login", { state: { from: `/lp/${lp.id}` } });
      }
    } else {
      navigate(`/lp/${lp.id}`);
    }
  };
  return(
    <div
      key={lp.id}
      onClick={cardClick}
      className="relative aspect-square overflow-hidden shadow-lg hover:shadow-2xl transition-transform duration-300 hover:scale-105"
      /* 마우스 포인터가 이 div 영역 안으로 들어올 때 실행*/
      onMouseEnter={() => setIsHovered(true)}
      /*마우스 포인터가 이 div 영역 밖으로 나갈 때 실행*/
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* LP 썸네일 이미지 */}
      <img
        src={lp.thumbnail}
        alt={lp.title}
        className="object-cover w-full h-full transition duration-300 hover:brightness-50"
      />

      {/* 'isHovered' 상태가 true일 때만 '&&' 뒤의 JSX 블록을 렌더링*/}
      {isHovered && (
        <div className="absolute pb-10 inset-0 z-10 bg-black/40 backdrop-brightness-75 transition-opacity duration-300 flex flex-col justify-end items-start text-white p-4 space-y-1">
          <h2 className="text-md font-bold">{lp.title}</h2>
          <p className="text-sm text-gray-300">
            {new Date(lp.createdAt).toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-300">{lp.likes.length} ♥️</p>
        </div>
      )}

      {/* 마우스를 올리지 않았을 때(평상시) 보이는 하단 제목 바*/}
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 p-2 z-0">
        <h3 className="text-white text-sm font-semibold truncate">
          {lp.title}
        </h3>
      </div>
    </div>
  )
}

export default LpCard;