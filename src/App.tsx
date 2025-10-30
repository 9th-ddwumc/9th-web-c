import './App.css'
import { createBrowserRouter, RouterProvider, type RouteObject } from 'react-router-dom';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/LoginPage';
import HomeLayout from './layouts/HomeLayout';
import SignupPage from './pages/SignupPage';
import { MyPage } from './pages/MyPage';
import { AuthProvider } from './context/AuthContext';
import ProtectedLayout from './layouts/ProtectedLayout';

//publicRoutes : 인증 없이 접근 가능한 라우트
const publicRoutes:RouteObject[] = [
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {index: true, element: <HomePage /> },
      {path: 'login', element: <LoginPage /> },
      {path: 'signup', element: <SignupPage /> },
    ]
  }
];

//protectedRoutes : 인증 후에 접근 가능한 라우트
const protectedRoutes: RouteObject[] = [
  {
    path: '/',
    element: <HomeLayout />, // ✅ HomeLayout으로 감싸기
    errorElement: <NotFoundPage />,
    children: [
      {
        element: <ProtectedLayout />, // ✅ 인증만 처리
        children: [
          { path: 'my', element: <MyPage /> },
        ],
      },
    ],
  },
];

const router = createBrowserRouter([...publicRoutes, ...protectedRoutes]);

function App() {

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App;
