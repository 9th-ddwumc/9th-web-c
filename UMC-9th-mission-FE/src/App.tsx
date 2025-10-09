import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import LoginPage from "./pages/LoginPage";
import HomeLayout from "./layouts/HomeLayout";
import SignupPage from "./pages/SignupPage";

const router = createBrowserRouter([
  {
    path:"/",
    element: <HomeLayout/>,//공유하는 요소들만
    errorElement: <NotFoundPage/>,
    children:[
      {index: true, element:<HomePage/>},// path:"/", 대신에 index: true, 사용
      {path: 'login', element: <LoginPage/>},
      {path: 'signup', element: <SignupPage/>}
    ]
  }
])
function App() {
 
  return <RouterProvider router={router} />

}

export default App
