import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { ResponseMyInfoDto } from '../types/auth';
import { getMyInfo } from '../apis/auth';
import { Search } from 'lucide-react';
import useLogout from '../hooks/mutations/useLogout';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEY } from '../constants/key';

interface NavbarProps {
  onMenuClick?: () => void;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const { accessToken } = useAuth();
  const navigate = useNavigate();

  const { mutate: logoutMutate, isPending } = useLogout();
  
  // ✅ React Query 사용 - accessToken이 있을 때만 활성화
  const { data } = useQuery<ResponseMyInfoDto>({
    queryKey: [QUERY_KEY.myInfo],
    queryFn: getMyInfo,
    enabled: !!accessToken, // accessToken이 있을 때만 쿼리 실행
  });

  const handleLogout = () => {
    logoutMutate();
  };

  return (
    <nav className='flex items-center justify-between px-6 py-4 border-b bg-[#171717] z-50 relative'>
      <div className='flex items-center gap-4'>
        <button
          onClick={onMenuClick}
          className='text-white hover:text-gray-300'
        >
          <svg width="24" height="24" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M7.95 11.95h32m-32 12h32m-32 12h32"/>
          </svg>
        </button>

        <Link to='/' className='flex items-center text-white text-xl font-bold'>
          Home
        </Link>
      </div>

      <div className='flex items-center gap-3'>
        <Link 
          to='/search'
          className='px-4 py-2 text-sm text-white font-medium hover:text-gray-300 transition-colors'
        >
          <Search size={18}/>
        </Link>
        {!accessToken ? (
          <>
            <button 
              type='button'
              className='px-4 py-2 text-sm text-white font-medium hover:text-gray-300 transition-colors'
              onClick={() => navigate('/login')}
            >
              로그인
            </button>
            <button 
              type='button'
              className='px-4 py-2 text-sm font-medium text-white bg-pink-600 rounded-lg hover:bg-pink-700 transition-colors'
              onClick={() => navigate('/signup')}
            >
              회원가입
            </button>
          </>
        ) : (
          <>
            <span className='text-sm text-gray-300'>
              {data?.data?.name || "사용자"} 님 반갑습니다.
            </span>
            <button 
              onClick={handleLogout}
              disabled={isPending}
              className='px-4 py-2 text-sm text-white font-medium hover:text-gray-300 transition-colors'
            >
              {isPending ? "로그아웃 중..." : "로그아웃"}
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;