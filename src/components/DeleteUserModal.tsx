interface DeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

const DeleteUserModal = ({ isOpen, onClose, onConfirm, isLoading }: DeleteUserModalProps) => {
  if (!isOpen) return null;

  return (
    <>
      {/* 오버레이 */}
      <div 
        className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center"
        onClick={onClose}
      >
        {/* 모달 */}
        <div 
          className="bg-[#171717] rounded-lg p-6 max-w-md relative border border-gray-800"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 내용 */}
          <div className="mt-2">
            <h2 className="text-xl font-semibold text-white mb-4">
              정말 탈퇴하시겠습니까? 😢
            </h2>
            <p className="text-sm text-gray-400 mb-6">
              탈퇴하시면 모든 데이터가 삭제되며 복구할 수 없습니다.
            </p>

            {/* 버튼 */}
            <div className="flex gap-3 justify-end">
              <button
                onClick={onClose}
                disabled={isLoading}
                className="px-4 py-2 text-sm text-white bg-gray-700 hover:bg-gray-600 rounded transition-colors"
              >
                아니오
              </button>
              <button
                onClick={onConfirm}
                disabled={isLoading}
                className="px-4 py-2 text-sm text-white bg-pink-600 hover:bg-pink-700 rounded transition-colors"
              >
                {isLoading ? "처리중..." : "예"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteUserModal;