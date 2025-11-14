import { useEffect, useState, useRef, ChangeEvent } from "react";
import { getMyInfo, patchMyInfo } from "../apis/auth";
import type { ResponseMyInfoDto } from "../types/auth";
import { Settings, Check } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../App";
import { QUERY_KEY } from "../constants/key";

export const MyPage = () => {
  const [data, setData] = useState<ResponseMyInfoDto | null>(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 내 정보 조회
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await getMyInfo();
        setData(response);
        setName(response.data?.name ?? "");
        setBio(response.data?.bio ?? "");
        setAvatarPreview(response.data?.avatar ?? "/avatar.jpg");
      } catch (err) {
        console.error("getMyInfo error:", err);
      }
    };
    getData();
  }, []);

  // 내 정보 수정 mutation
  const patchMutation = useMutation({
    mutationFn: patchMyInfo,
    onSuccess: updatedData => {
      setData(updatedData);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.myInfo] });
      setEditing(false);
    },
    onError: err => {
      console.error("내 정보 수정 실패:", err);
      alert("내 정보 수정에 실패했습니다.");
    },
  });

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = () => {
    if (!name.trim()) {
      alert("이름은 반드시 입력해야 합니다.");
      return;
    }

    patchMutation.mutate({
      name: name.trim(),
      bio: bio.trim() || "", // 비워도 됨
      avatar: avatarPreview,  // 파일 업로드는 서버에서 처리 필요
    });
  };

  return (
    <div className="h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="flex flex-row items-center bg-[#1f1f1f] rounded-2xl p-8 shadow-lg w-full max-w-lg gap-6">
        {/* 프로필 이미지 */}
        <div className="relative">
          <img
            src={avatarPreview || "/avatar.jpg"}
            alt="프로필 이미지"
            className={`w-28 h-28 rounded-full object-cover border border-gray-600 ${
              editing ? "cursor-pointer" : ""
            }`}
            onClick={() => {
              if (editing) fileInputRef.current?.click();
            }}
          />
          {editing && (
            <input
              type="file"
              className="hidden"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleAvatarChange}
            />
          )}
        </div>

        {/* 오른쪽 정보 */}
        <div className="flex flex-col justify-center flex-1">
          <div className="flex items-center justify-between mb-2">
            {editing ? (
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                className="text-lg font-semibold tracking-tight text-white border border-gray-500 focus:border-white focus:outline-none bg-transparent px-2 py-1 rounded"
              />
            ) : (
              <div className="text-lg font-semibold tracking-tight">
                {name || "이름 없음"}
              </div>
            )}

            <button
              onClick={() => (editing ? handleSave() : setEditing(true))}
              className="p-2 hover:bg-gray-700 rounded-full transition-colors"
            >
              {editing ? (
                <Check className="w-5 h-5 text-gray-300" />
              ) : (
                <Settings className="w-5 h-5 text-gray-300" />
              )}
            </button>
          </div>

          {/* bio */}
          {editing ? (
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              className="text-sm text-gray-300 border border-gray-500 focus:border-white focus:outline-none bg-transparent px-2 py-1 rounded resize-none"
              rows={2}
            />
          ) : (
            <div className="text-sm text-gray-300 mb-1">
              {bio || "자기소개가 없습니다."}
            </div>
          )}

          {/* 이메일 */}
          <p className="text-gray-400 text-sm">{data?.data?.email ?? "이메일 없음"}</p>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
