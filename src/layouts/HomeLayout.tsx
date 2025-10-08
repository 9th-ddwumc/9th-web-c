import { Outlet } from "react-router-dom";
import { Navbar } from '../components/Navbar';

const HomeLayout = () => {
  return (
    <div className='h-dvh flex flex-col'>
      <Navbar />
      <main className='flex-1 bg-black'>
        <Outlet />
      </main>
    </div>
  )
}

export default HomeLayout;