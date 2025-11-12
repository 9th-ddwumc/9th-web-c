// src/App.tsx
import { useEffect, useState } from "react";

type Page = "home" | "about" | "contact" | "projects";

export default function App() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const navigate = (url: string) => {
    window.history.pushState({}, "", url);
    setPath(url);
  };

  const renderPage = () => {
    switch (path) {
      case "/projects":
        return <h2>💼 Projects Page</h2>;
      case "/about":
        return <h2>ℹ️ About Page</h2>;
      case "/contact":
        return <h2>📞 Contact Page</h2>;
      default:
        return <h2>🏠 Home Page</h2>;
    }
  };

  return (
    <div>
      <nav style={{ background: "#eee", padding: "1rem" }}>
        <button onClick={() => navigate("/")}>Home</button>
        &nbsp; &nbsp;
        <button onClick={() => navigate("/about")}>About</button>
        &nbsp; &nbsp;
        <button onClick={() => navigate("/contact")}>Contact</button>
        &nbsp; &nbsp;
        <button onClick={() => navigate("/projects")}>Projects</button>
      
      </nav>

      <main style={{ padding: "1rem" }}>{renderPage()}</main>
    </div>
  );
}
