import { useNavigate } from 'react-router-dom';

export const Navbar = () => {
  const navigate = useNavigate();

  return (
    <div className='flex items-center justify-end gap-3 px-6 py-4 border-b'>
      <button 
        type='button'
        className='px-4 py-2 text-sm font-medium hover:text-gray-600 transition-colors'
        onClick={() => navigate('/login')}
      >
        로그인
      </button>
      <button 
        type='button'
        className='px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors'
        onClick={() => navigate('/signup')}
      >
        회원가입
      </button>
    </div>
  );
}