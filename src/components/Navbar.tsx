import { Link, useNavigate } from 'react-router-dom';

export const Navbar = () => {
  const navigate = useNavigate();

  return (
    <div className='flex items-center justify-between px-6 py-4 border-b bg-[#171717]'>
      <Link to='/' className='flex items-center text-white text-xl font-bold'>
        안녕하세요
      </Link>

      <div className='flex items-center gap-3'>
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
      </div>
    </div>
  );
}