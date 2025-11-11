import { createBrowserRouter, RouterProvider, type RouteObject } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import LoginPage from "./pages/LoginPage";
import HomeLayout from "./layouts/HomeLayout";
import SignupPage from "./pages/SignupPage";
import MyPage from "./pages/MyPage";
import { AuthProvider } from "./context/AuthContext";
import GoogleLoginRedirectPage from "./pages/GoogleLoginRedirectPage";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import LpDetailPage from "./pages/LpDetailPage";
import ProtectedLayout from "./layouts/ProtectedLayout";

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
      {path: "v1/auth/google/callback", element: <GoogleLoginRedirectPage/>},
      {path: "lp/:lpId", element: <LpDetailPage /> },
    ],
  },
]

//protectedRoutes:인증이 필요한 라우트
const protectedRoutes:RouteObject[] = [
  {
    path:"/",
    element: <HomeLayout />,
    errorElement: <NotFoundPage/>,
    children: [
      {
        element: <ProtectedLayout />, //  보호 기능만 추가
        children: [
          {
            path: "my",
            element: <MyPage />,
          },
        ],
      },
    ],
  },
];
const router = createBrowserRouter([...publicRoutes,...protectedRoutes]);
export const queryClient = new QueryClient();
function App() {
 
  return(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router ={router}/>
      </AuthProvider>
      {import.meta.env.DEV&& <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  )

}

export default App
