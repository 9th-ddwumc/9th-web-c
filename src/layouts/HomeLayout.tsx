import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FloatingButton from '../components/FloatingButton';
import Sidebar from '../components/Sidebar';
import AddLpModal from '../components/AddLpModal';
import useSidebar from '../hooks/useSidebar';

const HomeLayout = () => {
  const { isOpen: isSidebarOpen, open: openSidebar, close: closeSidebar } = useSidebar();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) closeSidebar();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className='h-dvh flex flex-col bg-black'>
      <Navbar onMenuClick={openSidebar}/>
      <div className='flex flex-1 overflow-hidden'>
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
        <main className='flex-1 overflow-y-auto'>
          <Outlet />
          <FloatingButton onClick={() => setIsModalOpen(true)} />
        </main>
      </div>
      <Footer />

      <AddLpModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}

export default HomeLayout;