import { useState } from "react"
import Home from "./pages/Home"
import About from "./pages/About"
import NotFound from "./pages/NotFound"
import "./App.css"

// 라우트 타입 정의
type Route = "/" | "/about" | "/wrong"

export default function App() {
  // 현재 경로 (처음에는 실제 브라우저 주소 사용)
  const [path, setPath] = useState<string>(window.location.pathname)

  // 페이지 이동 함수
  const navigate = (to: Route) => {
    window.history.pushState({}, "", to) // 주소창 변경
    setPath(to) // 상태 갱신
  }

  // popstate 이벤트 처리 (뒤로가기/앞으로가기)
  window.addEventListener("popstate", () => {
    setPath(window.location.pathname);
  });

  // 경로에 맞는 컴포넌트 렌더링
  const renderPage = () => {
    switch (path) {
      case "/":
        return <Home />
      case "/about":
        return <About />
      default:
        return <NotFound />
    }
  }

  return (
    <div>
      <nav style={{ marginBottom: "1rem" }}>
        <button className="nav-btn" onClick={() => navigate("/")}>Home</button>
        <button className="nav-btn" onClick={() => navigate("/about")}>About</button>
        <button className="nav-btn" onClick={() => navigate("/wrong")}>잘못된 경로</button>
      </nav>
      <main>{renderPage()}</main>
    </div>
  )
}