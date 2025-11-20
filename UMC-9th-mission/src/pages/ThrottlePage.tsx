import { useEffect, useState } from "react";
import useThrottle from "../hooks/useThrottle";

export const ThrottlePage = () => {
  const [scrollY, setScrollY] = useState(0);

  // throttledScrollY: 500ms마다만 업데이트
  const throttledScrollY = useThrottle(scrollY, 500);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  console.log("리렌더링", throttledScrollY);

  return (
    <div className="h-[200vh] flex flex-col items-center justify-center">
      <div>
        <h1>쓰로틀링이 무엇일까요?</h1>
        <p>ScrollY: {throttledScrollY}px</p>
      </div>
    </div>
  );
};
