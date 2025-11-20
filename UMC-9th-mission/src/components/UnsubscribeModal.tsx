import React from "react";
import { useUnsubscribe } from "../hooks/mutations/useAuthMutation"; // 경로 맞춰서 변경

interface UnsubscribeModalProps {
  onClose: () => void; // 모달 닫기 함수
}

const UnsubscribeModal: React.FC<UnsubscribeModalProps> = ({ onClose }) => {
  const { mutate: unsubscribe } = useUnsubscribe();

  const handleUnsubscribe = () => {
    unsubscribe(); // 서버 요청 + 상태 초기화 + 리다이렉트
    
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
      <div className="bg-[#1f1f1f] p-6 rounded-lg w-[320px] flex flex-col items-center gap-6">
        <p className="text-white text-center text-lg font-medium">
          정말 탈퇴하시겠습니까?
        </p>

        <div className="flex gap-4 w-full">
          <button
            className="flex-1 py-2 rounded-md text-white font-semibold"
            style={{ backgroundColor: "#ed2463" }}
            onClick={onClose}
          >
            아니오
          </button>
          <button
            className="flex-1 py-2 rounded-md text-white font-semibold"
            style={{ backgroundColor: "#555555" }} // 예 버튼은 밝은 회색
            onClick={handleUnsubscribe}
          >
            예
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnsubscribeModal;