import { Outlet } from "react-router-dom";
import { FloatingButton } from "../components/FloatingButton";
import {Navbar} from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useState } from "react";
import LpCardModal from "../components/LpCardModal";



const HomeLayout = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="h-full flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-y-auto px-6 text-white bg-black">
          <Outlet />
          {isModalOpen && <LpCardModal onClose={() => setIsModalOpen(false)} />}
          <FloatingButton onClick={() => setIsModalOpen(true)} />
        </main>
      </div>
    </div>
  );
};

export default HomeLayout;