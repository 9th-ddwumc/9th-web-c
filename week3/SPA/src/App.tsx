import { useState } from "react";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";


function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  window.onpopstate = () => setCurrentPath(window.location.pathname);

  const navigate = (path: string) => {
    window.history.pushState({}, "", path);
    setCurrentPath(path);
  };

 let page;
  if (currentPath === "/") 
    page = <Home />;
  else if (currentPath === "/about") 
    page = <About />;
  else if (currentPath === "/contact") 
    page = <Contact />;
  else 
    page = <NotFound />;

  return(
    <>
      <nav>
        <a href="/" onClick={(e) => {e.preventDefault(); navigate("/");}}>Home</a> | {" "}
        <a href="/about" onClick={(e) => {e.preventDefault(); navigate("/about");}}>About</a> | {" "}
        <a href="/contact" onClick={(e) => {e.preventDefault(); navigate("/contact");}}>Contact</a>
      <hr/>
      </nav>
      {page}
    </>
  )
}

export default App;