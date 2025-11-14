import { X } from "lucide-react";
import { useRef, useState } from "react";
import usePostLp from "../hooks/mutations/usePostLp";
import { RequestPostLpDto } from "../types/lp";

const LpCardModal = ({ onClose }: { onClose: () => void }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [title, setTitle] = useState("");       // LP 제목
  const [content, setContent] = useState("");   // LP 내용
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const { mutate: postLpMutate, } = usePostLp();

  // 배경 클릭 시 닫기
  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  // 이미지 클릭 시 파일 선택창 열기
  const handleImageClick = () => fileInputRef.current?.click();

  // 파일 선택 시 미리보기 설정
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // 태그 추가
  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput("");
    }
  };

  // 태그 삭제
  const handleRemoveTag = (tag: string) => setTags(tags.filter((t) => t !== tag));

  // Enter 키로 태그 추가
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  // LP 생성
  const handleAddLp = () => {
    if (!title.trim() || !content.trim() || !previewImage) {
      alert("제목, 내용, 썸네일을 모두 입력해주세요.");
      return;
    }

    const dto: RequestPostLpDto = {
      title: title.trim(),
      content: content.trim(),
      thumbnail: previewImage,
      tags,
      published: true,
    };

    postLpMutate(dto, {
      onSuccess: () => {
        onClose(); // 모달 닫기
      },
    });
  };

  return (
    <div
      onClick={handleBackgroundClick}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div
        ref={modalRef}
        className="relative w-[400px] bg-[#2c2c2c] rounded-2xl shadow-xl flex flex-col items-center px-6 py-8 space-y-6"
      >
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>

        {/* 업로드 섹션 */}
        <div
          onClick={handleImageClick}
          className="relative cursor-pointer w-48 h-48 mb-6 flex items-center justify-center"
        >
          {!previewImage ? (
            <img
              src="/vinyl.png"
              alt="LP"
              className="w-36 h-36 object-cover rounded-full transition-transform hover:scale-105"
            />
          ) : (
            <div className="relative left-[-30px] w-[220px] h-[180px] flex items-center justify-center">
              <div className="w-[160px] h-[160px] overflow-hidden shadow-lg z-20 border border-gray-600">
                <img
                  src={previewImage}
                  alt="Uploaded"
                  className="w-full h-full object-cover"
                />
              </div>
              <img
                src="/vinyl.png"
                alt="LP"
                className="absolute right-[-60px] w-[150px] h-[150px] object-cover rounded-full z-10"
              />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* 입력 폼 */}
        <div className="w-full flex flex-col space-y-4">
          <input
            type="text"
            placeholder="LP Name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-transparent border border-gray-600 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-pink-500"
          />
          <input
            type="text"
            placeholder="LP Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-transparent border border-gray-600 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-pink-500"
          />

          {/* 태그 입력 */}
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="LP Tag"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent border border-gray-600 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-pink-500"
            />
            <button
              onClick={handleAddTag}
              className="bg-gray-500 hover:bg-pink-600 text-white rounded-md px-4 text-sm"
            >
              Add
            </button>
          </div>

          {/* 태그 리스트 */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag) => (
                <div
                  key={tag}
                  className="flex items-center bg-pink-600/30 border border-pink-600 text-white rounded-full px-3 py-1 text-xs"
                >
                  <span>{tag}</span>
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 text-gray-300 hover:text-white"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* LP 추가 버튼 */}
        <button type="button"
          onClick={handleAddLp}
          className={`w-full bg-pink-600 hover:bg-pink-700 text-white rounded-md py-2 text-sm font-semibold mt-4`}
        >
          Add LP
        </button>
      </div>
    </div>
  );
};

export default LpCardModal;
