import { X } from "lucide-react";
import { useState } from "react";
import useAddLp from "../hooks/mutations/useAddLp";
import type { AddLpDto } from "../types/lp";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddLpModal = ({ isOpen, onClose }: ModalProps) => {
  const [title, setTitle] = useState(""); // LP 이름 상태
  const [content, setContent] = useState(""); // LP 내용 상태
  const [tagInput, setTagInput] = useState(""); // 태그 입력창 상태
  const [tags, setTags] = useState<string[]>([]); // 태그 목록 상태
  const [thumbnail, setThumbnail] = useState(""); // 썸네일 상태

  const { mutate: addLpMutate, isPending } = useAddLp();
  const { accessToken } = useAuth();

  const resetForm = () => {
    setTitle("");
    setContent("");
    setTags([]);
    setTagInput("");
    setThumbnail("");
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => { // 사용자가 파일 선택창에서 파일을 선택하면 이 이벤트가 발생
    const file = e.target.files?.[0]; // 선택한 파일 배열 중 첫 번째 가져옴
    if (!file) return; // 파일 없으면 함수 종료

    const formData = new FormData();
    formData.append("file", file); // 서버에서 file이라는 이름으로 파일 받도록 설정

    try {
      const { data } = await axios.post(
        "http://localhost:8000/v1/uploads", // 이미지 업로드 엔드포인트
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`, // 로그인 필요하므로 토큰 같이 보냄
          },
        }
      );

      setThumbnail(data.data.imageUrl); // 서버가 반환한 imageUrl 상태(thumbnail)에 저장
      console.log("업로드 성공, imageUrl:", data.data.imageUrl);
    } catch (err) {
      console.error("이미지 업로드 실패:", err);
      alert("이미지 업로드에 실패했습니다.");
    }
  };

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput("");
    }
  };

  const handleDeleteTag = (tagToDelete: string) => {
    setTags(tags.filter((tag) => tag !== tagToDelete));
  };

const handleAddLp = () => {
  const data: AddLpDto = {
    title,
    content,
    published: true,
    tags,
    ...(thumbnail && { thumbnail }), // thumbnail 있을 때만 포함
  };

  addLpMutate(data, {
    onSuccess: () => {
      alert("LP 등록이 완료되었습니다.");
      onClose();
      resetForm();
    },
    onError: () => {
      alert("LP 등록이 실패했습니다. 다시 시도해 주세요.");
    },
  });
};

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/75 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-[#1f1f1f] rounded-xl p-6 text-white w-100 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <div className="flex justify-end mb-4">
          <button onClick={onClose} className="cursor-pointer">
            <X size={20} />
          </button>
        </div>

        {/* Thumbnail */}
        <div className="flex items-center justify-center aspect-square rounded-full mb-6 relative w-80 h-80 mx-auto">
          {thumbnail ? (
            <div className="relative w-full h-full rounded-full overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="w-1/4 h-1/4 bg-[#171717] rounded-full" />
              </div>
              <img
                src={thumbnail}
                alt="LP Thumbnail"
                className="w-full h-full object-cover rounded-full"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 w-full h-full rounded-full opacity-0 cursor-pointer"
              />
            </div>
          ) : (
            <div className="relative w-full h-full rounded-full bg-gray-600 flex items-center justify-center overflow-hidden">
              <div className="absolute w-1/4 h-1/4 bg-[#171717] rounded-full z-10" />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 w-full h-full rounded-full opacity-0 cursor-pointer"
              />
            </div>
          )}
        </div>

        {/* Input Fields */}
        <div className="flex flex-col gap-3 mb-3">
          <input
            placeholder="LP Name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border border-gray-500 rounded-lg px-4 py-2 placeholder-gray-500
              focus:outline-none focus:border-pink-600 transition"
          />
          <textarea
            placeholder="LP Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="border border-gray-500 rounded-lg px-4 py-2 placeholder-gray-500
              focus:outline-none focus:border-pink-600 transition h-24 resize-none"
          />
        </div>

        {/* Tag Input & Add Button */}
        <div className="flex gap-2 mb-2">
          <input
            placeholder="LP Tag"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            className="flex-1 border border-gray-500 rounded-lg px-4 py-2 placeholder-gray-500
              focus:outline-none focus:border-pink-600 transition"
          />
          <button
            onClick={handleAddTag}
            disabled={!tagInput.trim()}
            className={`border rounded-lg px-6 py-2 transition
              ${tagInput.trim()
                ? 'bg-pink-600 border-pink-600 text-white hover:bg-pink-700 cursor-pointer'
                : 'bg-gray-500 border-gray-500 text-gray-300 cursor-not-allowed'}`}
          >
            Add
          </button>
        </div>

        {/* Tag List */}
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <div
              key={tag}
              className="flex items-center gap-1 bg-pink-600 text-white px-3 py-1 rounded-full text-sm"
            >
              <span>{tag}</span>
              <button
                onClick={() => handleDeleteTag(tag)}
                className="text-white hover:text-gray-300 font-bold"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        {/* Add LP Button */}
        <button
          onClick={handleAddLp}
          disabled={!title.trim() || !content.trim() || isPending}
          className={`border rounded-lg w-full px-6 py-2 mt-3 transition
            ${title.trim() && content.trim()
              ? 'bg-pink-600 border-pink-600 text-white hover:bg-pink-700 cursor-pointer'
              : 'bg-gray-500 border-gray-500 text-gray-300 cursor-not-allowed'}`}
        >
          {isPending ? 'Adding...' : 'Add LP'}
        </button>
      </div>
    </div>
  );
};

export default AddLpModal;