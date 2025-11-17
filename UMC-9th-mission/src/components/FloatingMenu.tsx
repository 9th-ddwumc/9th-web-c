import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { queryClient } from "../App";
import { postLp } from "../apis/lp";
import axios from "axios";
import type { RequestCreateLpDto } from "../types/lp";
import { LOCAL_STORAGE_KEY, QUERY_KEY } from "../constants/key";

export default function FloatingMenu() {
  const [isOpen, setIsOpen] = useState(false); // 플로팅 메뉴 열림/닫힘
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림/닫힘
  const modalRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null); //  플로팅 메뉴 ref
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");   // input 상태
  const [tags, setTags] = useState<string[]>([]);// 태그 배열 상태
  const [uploadImgUrl, setUploadImgUrl] = useState(""); // 업로드된 이미지 URL 저장

  // 폼 리셋 함수
  const resetForm = () => {
    setTitle("");
    setContent("");
    setTagInput("");
    setTags([]);
    setUploadImgUrl("");
  };

  // 플로팅 메뉴에 표시될 아이템 목록
  const menuItems = [
    { label: "홈", emoji: "🏠", path: "/" },
    { label: "로그인", emoji: "🔑", path: "/login" },
    { label: "회원가입", emoji: "✍️", path: "/signup" },
    { label: "LP 추가", emoji: "💿", path: null },
  ];

  //  모달 바깥 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // modalRef.current가 존재하고, 클릭된 타겟이 모달 내부에 포함되지 않을 때
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsModalOpen(false);
      }
    };
    // 모달이 열려있을 때만 이벤트 리스너 추가
    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    // 컴포넌트가 언마운트되거나 isModalOpen이 바뀌기 전에 리스너 제거
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isModalOpen]);

  // 플로팅 메뉴 외부 클릭 닫기
  useEffect(() => {
    const handleClickOutsideMenu = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutsideMenu);
    return () => document.removeEventListener("mousedown", handleClickOutsideMenu);
  }, [isOpen]);

  // 태그 추가
  const handleAddTag = () => {
    const trimmed = tagInput.trim(); // 공백 제거
    if (trimmed && !tags.includes(trimmed)) { // 내용이 있고 중복되지 않을 때
      setTags((prev) => [...prev, trimmed]); // 태그 배열에 추가
      setTagInput(""); // 입력창 비우기
    }
  };

  // 태그 삭제
  const handleRemoveTag = (tag: string) => {
    // 해당 태그만 제외하고 새 배열 생성
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  //1. 이미지 업로드 핸들러 
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const formData = new FormData(); // 파일 전송을 위한 FormData 객체
    formData.append("file", file);

    // 로컬 스토리지에서 토큰 가져오기 (JSON 문자열로 저장된 것을 parse)
    const rawToken = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);
    const token = rawToken ? JSON.parse(rawToken) : null; // JSON.parse 사용 

    // 토큰 유무에 따라 업로드 URL 분기
    const uploadUrl = token
      ? "http://localhost:8000/v1/uploads" // 회원용
      : "http://localhost:8000/v1/uploads/public"; // 비회원용

    const headers: HeadersInit = {};
    if (token) {
      // 헤더에 토큰 추가
      headers["Authorization"] = `Bearer ${token}`;
    }

    try {
      // 'fetch' API를 사용해 이미지 파일을 서버로 전송
      const response = await fetch(uploadUrl, {
        method: "POST",
        headers,
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        // [핵심] 성공 시, 서버가 돌려준 이미지 URL을 'uploadImgUrl' state에 저장
        setUploadImgUrl(result.data.imageUrl); // URL 저장
      } else {
        console.error("이미지 업로드 실패:", result.message);
        alert("이미지 업로드에 실패했습니다.");
      }
    } catch (e) {
      console.error(e);
      alert("이미지 업로드 중 오류 발생.");
    }
  };

  // 2. LP 생성(폼 제출) mutation
  const mutation = useMutation({
    mutationFn: async () => {
      const imageUrl = "https://example.com/temp-image.png";

      // 폼 데이터를 DTO(Data Transfer Object) 형식으로 조립
      const lpData: RequestCreateLpDto = {
        title: title,
        content: content,
        thumbnail: uploadImgUrl, // handleImageUpload에서 받은 URL을 사용
        tags: tags,
        published: true,
      };

      // `postLp` API 함수를 호출해 서버에 최종 데이터 전송
      return await postLp(lpData);
    },
    onSuccess: (lp) => {
      // LP 목록 쿼리 갱신(무효화)
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.lps],
      });
      setIsModalOpen(false);
      resetForm(); // 폼 초기화
      alert("LP 등록 성공!");
    },
    onError: (err) => {
      alert("LP 등록 실패");

      if (axios.isAxiosError(err)) {
        console.error("서버 응답:", err.response?.data);
      } else {
        console.error(err);
      }
    },
  });

  return (
    <div className="fixed bottom-6 right-6 flex flex-col items-end z-50">


      {/* LP 작성 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div
            ref={modalRef} // 외부 클릭 감지를 위해 ref 연결
            className="bg-white rounded-2xl p-6 w-96 shadow-xl relative"
          >
            {/* X 버튼 */}
            <button
              onClick={() => {
                setIsModalOpen(false);
                resetForm(); // X 버튼 클릭 시에도 폼 리셋
              }}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-4 text-center">LP 추가</h2>

            {/* 폼 제출 핸들러 */}
            <form
              onSubmit={(e) => {
                e.preventDefault(); // 기본 폼 제출(새로고침) 방지

                // [중요] 이미지 URL이 state에 저장되어 있는지 확인
                if (!uploadImgUrl) {
                  alert("LP 커버 이미지를 먼저 업로드해주세요.");
                  return; // 이미지가 없으면 제출(mutation)을 중단
                }

                mutation.mutate(); // [중요] 이미지 URL이 state에 저장되어 있는지 확인
              }}
              className="flex flex-col gap-3"
            >
              <input
                type="text"
                name="title"
                placeholder="LP 이름"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="border rounded-lg p-2"
              />
              <textarea
                name="content"
                placeholder="LP 내용"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={4}
                className="border rounded-lg p-2 resize-none"
              />
              <input
                type="file"
                name="thumbnail"
                accept="image/*"
                onChange={handleImageUpload}
                required
                className="border rounded-lg p-2"
              />
              {/* 태그 입력 + Add 버튼 */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="태그 입력"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  className="flex-1 border rounded-lg p-2"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="bg-blue-500 text-white px-3 rounded-lg hover:bg-blue-600 transition"
                >
                  Add
                </button>
              </div>
              {/* 태그 목록 */}
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <div
                    key={tag}
                    className="flex items-center bg-gray-200 rounded-full px-2 py-1 text-sm"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="submit"
                className="bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700 transition"
              >
                등록하기
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 플로팅 메뉴 */}
      {isOpen && (
        <div ref={menuRef} className="flex flex-col items-end mb-3">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                if (item.path) navigate(item.path);
                else setIsModalOpen(true);
                setIsOpen(false);
              }}
              className="flex items-center gap-2 bg-white px-3 py-2 rounded-full shadow-md mb-3 hover:bg-gray-100 transition"
            >
              <span className="text-lg">{item.emoji}</span>
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* 메인 플로팅 버튼 (메뉴 열기/닫기 토글) */}
      <button
        onClick={() => {
          setIsOpen(!isOpen)
        }}
        className={`${isOpen ? "bg-gray-400 hover:bg-gray-500" : "bg-pink-600 hover:bg-pink-700"
          } text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-105`}
      >
        <span className="text-2xl">{isOpen ? "✖" : "＋"}</span>
      </button>
    </div>
  );
}
