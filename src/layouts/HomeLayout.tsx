import { Outlet, useNavigate } from "react-router-dom";

const HomeLayout = () => {
  const navigate = useNavigate();

  return <div className='h-dvh flex flex-col'>
    <nav className='flex items-center p-2 pt-4  bg-[#1f1f1f]'>
      <h1 className=' text-[#ed2463] font-bold'>돌려돌려LP판</h1>
      <div className='flex gap-2 ml-auto'>
        <button onClick={() => navigate("/login")}
        className='text-white bg-black p-1 px-3 rounded-sm
        hover:cursor-pointer hover:font-bold'>로그인</button>
        <button onClick={() => navigate("/signup")}
        className='text-white bg-[#ed2463] p-1 px-3 rounded-sm
        hover:cursor-pointer hover:font-bold'>회원가입</button>
      </div>      
    </nav>
    <main className='flex-1 bg-black text-white'>
        <Outlet />
    </main>
    <footer className='bg-black'></footer>
  </div>;
}
export default HomeLayout;