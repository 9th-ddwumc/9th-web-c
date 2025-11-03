import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { accessToken } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className='flex items-center justify-between px-6 py-4 border-b bg-[#171717]'>
      {/* 왼쪽: 홈 */}
      <Link to='/' className='flex items-center text-white text-xl font-bold'>
        안녕하세요
      </Link>

      {/* 오른쪽: 버튼 그룹 */}
      <div className='flex items-center gap-3'>
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
          <Link 
            to='/mypage'
            className='px-4 py-2 text-sm text-white font-medium hover:text-gray-300 transition-colors'
          >
            마이페이지
          </Link>
        )}

        {/* 검색은 항상 표시 */}
        <Link 
          to='/search'
          className='px-4 py-2 text-sm text-white font-medium hover:text-gray-300 transition-colors'
        >
          검색
        </Link>
      </div>
    </nav>
  );
};
