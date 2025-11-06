import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function FloatingMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { label: "홈", emoji: "🏠", path: "/" },
    { label: "로그인", emoji: "🔑", path: "/login" },
    { label: "회원가입", emoji: "✍️", path: "/signup" },
  ];

  return (
    <div className="fixed bottom-6 right-6 flex flex-col items-end z-50">
      {isOpen &&
        menuItems.map((item, index) => (
          <button
            key={index}
            onClick={() => {
              navigate(item.path);
              setIsOpen(false);
            }}
            className="flex items-center gap-2 bg-white px-3 py-2 rounded-full shadow-md mb-3 hover:bg-gray-100 transition"
          >
            <span className="text-lg">{item.emoji}</span>
            <span className="text-sm">{item.label}</span>
          </button>
        ))}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-pink-600 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-pink-700 transition-transform hover:scale-105"
      >
        <span className="text-2xl">＋</span>
      </button>
    </div>
  );
}
