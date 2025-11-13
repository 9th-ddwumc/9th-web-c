import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Check, Pencil, X } from 'lucide-react';
import useGetMyInfo from "../hooks/queries/useGetMyInfo";
import { useState } from "react";
import useUpdateMyInfo from "../hooks/mutations/useUpdateMyInfo";

export const MyPage = () => {
  const navigate = useNavigate();
  const { logout, accessToken } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editAvatar, setEditAvatar] = useState('');

  const { data } = useGetMyInfo(accessToken);
  const { mutate: updateMyInfoMutate } = useUpdateMyInfo();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleEditStart = () => {
    if (!data?.data) return;
    setEditName(data.data.name);
    setEditBio(data.data.bio || '');
    setEditAvatar(data.data.avatar || '');
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleUpdate = () => {
    if (!editName.trim()) {
      alert('이름을 입력해주세요.');
      return;
    }

    updateMyInfoMutate(
      {
        name: editName,
        bio: editBio,
        avatar: editAvatar || undefined,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
          alert('프로필이 수정되었습니다.');
        },
        onError: (error: any) => {
          console.error('프로필 수정 실패:', error);
          alert('프로필 수정에 실패했습니다.');
        },
      }
    );
  };

  // 변경사항 확인
  const hasChanges =
    editName !== data?.data?.name ||
    editBio !== (data?.data?.bio || '') ||
    editAvatar !== (data?.data?.avatar || '');

  if (!data) return <div className='text-white'>정보 조회 실패</div>;

  return (
    <div className='min-h-screen bg-black text-white p-6'>
      <div className='max-w-2xl mx-auto'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold'>My Page</h1>
        </div>

        <div className='bg-[#1f1f1f] rounded-lg p-8 shadow-xl'>
          <div className='flex items-start gap-6 mb-8'>
            <div className='flex-shrink-0'>
              {isEditing ? (
                <div>
                  <img
                    src={editAvatar || '/profile.png'}
                    alt="프로필"
                    className='w-24 h-24 rounded-full object-cover mb-2'
                  />
                </div>
              ) : (
                <img
                  src={data.data?.avatar || '/profile.png'}
                  alt="프로필"
                  className='w-24 h-24 rounded-full object-cover'
                />
              )}
            </div>

            <div className='flex-1'>
              {isEditing ? (
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className='w-full text-2xl font-bold mb-2 bg-[#222] text-white px-3 py-1 rounded border border-gray-600 focus:outline-none focus:border-pink-600'
                  placeholder='이름'
                />
              ) : (
                <h2 className='text-2xl font-bold mb-2'>
                  {data.data?.name}
                </h2>
              )}
              <p className='text-gray-400 text-sm'>
                {data.data?.email}
              </p>
            </div>

            <div className='flex gap-4'>
              {isEditing ? (
                <>
                  <button
                    onClick={handleCancelEdit}
                    className='cursor-pointer hover:text-gray-400 transition-colors'
                  >
                    <X size={20} />
                  </button>
                  <button
                    onClick={handleUpdate}
                    disabled={!hasChanges}
                    className={`transition-colors ${
                      hasChanges
                        ? 'hover:text-pink-600 cursor-pointer'
                        : 'text-gray-600'
                    }`}
                  >
                    <Check size={20} />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleEditStart}
                    className='cursor-pointer hover:text-gray-400 transition-colors'
                  >
                    <Pencil size={20} />
                  </button>
                  <button
                    onClick={handleLogout}
                    className='px-4 py-2 bg-pink-600 hover:bg-pink-700 transition-colors rounded-md text-sm'
                  >
                    로그아웃
                  </button>
                </>
              )}
            </div>
          </div>

          <div className='border-t border-gray-500 my-6'></div>

          <div>
            {isEditing ? (
              <textarea
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                className='w-full bg-[#222] text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-pink-600 resize-none'
                rows={4}
                placeholder='소개글을 입력하세요 (선택)'
              />
            ) : (
              <>
                {data.data?.bio ? (
                  <p className='text-gray-300 leading-relaxed'>
                    {data.data.bio}
                  </p>
                ) : (
                  <p className='text-gray-500 italic'>
                    아직 소개글이 없습니다.
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPage;