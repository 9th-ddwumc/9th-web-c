import { createBrowserRouter, RouterProvider, type RouteObject } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import LoginPage from "./pages/LoginPage";
import HomeLayout from "./layouts/HomeLayout";
import SignupPage from "./pages/SignupPage";
import MyPage from "./pages/MyPage";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedLayout } from "./layouts/ProtectedLyout";

//publicRoutes:인증 없이 접근 가능한 라우트
const publicRoutes:RouteObject[] = [
   {
    path:"/",
    element: <HomeLayout/>,//공유하는 요소들만
    errorElement: <NotFoundPage/>,
    children:[
      {index: true, element:<HomePage/>},// path:"/", 대신에 index: true, 사용
      {path: "login", element: <LoginPage/>},
      {path: "signup", element: <SignupPage/>},
    ],
  },
]

//protectedRoutes:인증이 필요한 라우트
const protectedRoutes:RouteObject[] = [
  {
    path:"/",
    element:<ProtectedLayout/>,
    errorElement: <NotFoundPage/>,
    children:[
      {
        path:"my",
        element:<MyPage/>,
      },
    ],
  },
];
const router = createBrowserRouter([...publicRoutes,...protectedRoutes]);
function App() {
 
  return(
    <AuthProvider>
      <RouterProvider router ={router}/>
    </AuthProvider>
  )

}

export default App
