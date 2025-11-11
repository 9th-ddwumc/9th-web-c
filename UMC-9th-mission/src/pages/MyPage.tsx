import {  useState } from "react";
import { updateMyInfo } from "../apis/auth";
import type { RequestUpdateMyInfoDto } from "../types/auth";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useGetMyInfo from "../hooks/queries/useGetMyInfo";
import { Settings } from "lucide-react";

const MyPage = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { accessToken, logout } = useAuth();

    const { data: me, isPending, isError } = useGetMyInfo(accessToken);
    /*
   //컴포넌트 마운트 시 데이터 로드.
   useEffect(() => {
       //비동기 함수 선언(내부에서 API 호출)
       const getData = async () => {
           //서버에서 내 정보를 가져옴
           const response = await getMyInfo();
           console.log(response);

           setData(response);
       };
       getData();
   },[]);
   */

    // 모달 UI를 위한 상태
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 폼 입력을 위한 상태
    const [editedName, setEditedName] = useState("");
    const [editedBio, setEditedBio] = useState("");
    const [editedAvatarUrl, setEditedAvatarUrl] = useState("");

    // 정보 수정을 위한 useMutation
    const updateMutation = useMutation({
        mutationFn: (dto: RequestUpdateMyInfoDto) => updateMyInfo(dto),
        /**낙관적 업데이트 적용 */
        //  서버 응답 전 즉시 닉네임 반영 (낙관적 업데이트)
        onMutate: async (dto) => {
            // 1.기존 데이터 가져오기 (rollback 대비)
            await queryClient.cancelQueries({ queryKey: ["myInfo"] });
            const previousData = queryClient.getQueryData(["myInfo"]);

            // 2️. 새로운 데이터로 즉시 캐시 업데이트
            queryClient.setQueryData(["myInfo"], (old: any) => {
                if (!old?.data) return old;
                return {
                    ...old,
                    data: {
                        ...old.data,
                        name: dto.name, // 새 닉네임
                        bio: dto.bio ?? old.data.bio,
                        avatar: dto.avatar ?? old.data.avatar,
                    },
                };
            });

            // 3️. rollback을 위해 이전 상태 반환
            return { previousData };
        },

        // 서버 응답 성공
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["myInfo"] });
            setIsModalOpen(false);
        },

        // 서버 응답 실패 시 롤백
        onError: (err, _dto, context) => {
            if (context?.previousData) {
                queryClient.setQueryData(["myInfo"], context.previousData);
            }
            console.error("정보 수정 실패:", err);
            alert("정보 수정에 실패했습니다.");
        },

        /**낙관적 업데이트 미적용 */
        //     onSuccess: (updatedData) => {
        //     //  성공 시 'myInfo' 쿼리 무효화로 자동 새로고침
        //     queryClient.invalidateQueries({ queryKey: ["myInfo"] });

        //     // 즉각적인 UI 업데이트를 위해 캐시를 수동으로 덮어쓸 수 있다.
        //     //queryClient.setQueryData(['myInfo'], updatedData);

        //     setIsModalOpen(false); // 모달 닫기
        //     },
        //     onError: (err) => {
        //     console.error("정보 수정 실패:", err);

        //     if (err && typeof err === 'object' && 'response' in err) {
        //     console.error("서버 응답:", (err as any).response?.data);
        //   }

        //     alert("정보 수정에 실패했습니다.");
        //     },
    });

    const handleLogout = async () => {
        await logout();
        navigate("/");
    }

    // 모달 열기 핸들러 (폼 상태를 현재 데이터로 초기화)
    const openEditModal = () => {
        if (me?.data) {
            setEditedName(me.data.name);
            setEditedBio(me.data.bio || ""); // null이면 빈 문자열로
            setEditedAvatarUrl(me.data.avatar || ""); // null이면 빈 문자열로
        }
        setIsModalOpen(true);
    };

    // 폼 제출 핸들러
    const handleSubmitChanges = (e: React.FormEvent) => {
        e.preventDefault();
        const name = editedName.trim();
        if (!name) {
            alert("이름은 필수입니다.");
            return;
        }

        // bio와 avatar는 비어있어도(empty string) 전송
        const dto: RequestUpdateMyInfoDto = {
            name,
            // bio와 avatar가 비어있으면 null로 전송 (API 스펙에 따라 조율 필요)
            // 만약 빈 문자열 ""을 보내야 한다면 trim()만 사용
            bio: editedBio.trim() || null, // 비어있으면 undefined (JSON 전송 시 제외됨)
            avatar: editedAvatarUrl.trim() || null,
        };
        updateMutation.mutate(dto);
    };

    // 로딩 및 에러 처리
    if (isPending) {
        return <div className="text-white p-4">로딩 중...</div>;
    }
    if (isError || !me?.data) {
        return <div className="text-red-500 p-4">내 정보를 불러오는데 실패했습니다.</div>;
    }


    return (
        <div>
            <h1>{me.data.name}님 환영합니다.</h1>

            {/* 설정 버튼 */}
            <button
                onClick={openEditModal}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-gray-700"
                aria-label="정보 수정"
            >
                <Settings size={20} />
            </button>

            <img
                src={me.data.avatar || "/default-avatar.png"}
                alt="프로필 아바타"
                className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-gray-700 object-cover"
            />
            <div className="text-center mb-6">
                <p className="text-lg text-gray-300">{me.data.email}</p>
                {me.data.bio && (
                    <p className="text-md text-gray-400 mt-2 italic">"{me.data.bio}"</p>
                )}
            </div>

            <button
                className="w-full py-2 px-4 cursor-pointer bg-pink-600 rounded-md hover:bg-pink-700 transition-colors"
                onClick={handleLogout}
            >
                로그아웃
            </button>
            {/* 정보 수정 모달 */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
                    onClick={() => setIsModalOpen(false)} // 배경 클릭 시 닫기
                >
                    <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md"
                        onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 닫히지 않게
                    >
                        <h2 className="text-xl font-bold mb-4">프로필 수정</h2>

                        <form onSubmit={handleSubmitChanges} className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-300">이름 (필수)</label>
                                <input
                                    id="name"
                                    type="text"
                                    value={editedName}
                                    onChange={(e) => setEditedName(e.target.value)}
                                    className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="bio" className="block text-sm font-medium text-gray-300">소개 (선택)</label>
                                <textarea
                                    id="bio"
                                    value={editedBio}
                                    onChange={(e) => setEditedBio(e.target.value)}
                                    rows={3}
                                    className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 rounded-md text-white resize-none focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    placeholder="자기 소개를 입력하세요..."
                                />
                            </div>

                            <div>
                                <label htmlFor="avatarUrl" className="block text-sm font-medium text-gray-300">프로필 사진 URL (선택)</label>
                                <input
                                    id="avatarUrl"
                                    type="text"
                                    value={editedAvatarUrl}
                                    onChange={(e) => setEditedAvatarUrl(e.target.value)}
                                    className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    placeholder="https://..."
                                />
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 bg-gray-600 rounded-md hover:bg-gray-500 transition-colors"
                                    disabled={updateMutation.isPending}
                                >
                                    취소
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-pink-600 rounded-md hover:bg-pink-700 transition-colors disabled:bg-gray-500"
                                    disabled={updateMutation.isPending}
                                >
                                    {updateMutation.isPending ? "저장 중..." : "저장"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>

    )
}

export default MyPage;