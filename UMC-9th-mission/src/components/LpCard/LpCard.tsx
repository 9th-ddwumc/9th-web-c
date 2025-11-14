import { Heart } from "lucide-react";
import { Lp } from "../../types/lp";
import { useNavigate } from "react-router-dom";

interface LpCardProps {
    lp: Lp
}

const LpCard = ({lp}:LpCardProps) => {
    const navigator = useNavigate();
    return (<div
            onClick={() => navigator(`/lp/${lp.id}`)} // ✅ 카드 클릭 시 라우팅
            className="relative overflow-hidden rounded-2xl shadow-md transition-transform duration-300 hover:scale-105 group cursor-pointer"
          >
            {/* LP 썸네일 */}
            <img
              src={lp.thumbnail}
              alt={lp.title}
              className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-110"
            />

            {/* Hover 오버레이 + 메타 정보 */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
              {/* 제목 (두 줄 + ellipsis) */}
              <h3
                className="text-white text-lg font-semibold line-clamp-2"
                title={lp.title}
              >
                {lp.title}
              </h3>

              {/* 업로드일 + 좋아요 */}
              <div className="flex justify-between items-center text-sm text-gray-200 mt-2">
                <span>
                  {new Date(lp.createdAt).toLocaleString("ko-KR", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </span>
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4 text-pink-400" />
                  <span>{lp.likes?.length ?? 0}</span>
                </div>
              </div>
            </div>
          </div>);
};

export default LpCard;