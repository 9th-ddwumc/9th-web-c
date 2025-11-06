import { Outlet } from "react-router-dom";
import { FloatingButton } from "../components/FloatingButton";
import {Navbar} from "../components/Navbar";
import Sidebar from "../components/Sidebar";



const HomeLayout = () => {
  return (
    <div className="h-full flex flex-col bg-black">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-y-auto px-6 text-white">
          <Outlet />
          <FloatingButton />
        </main>
      </div>
    </div>
  );
};

export default HomeLayout;