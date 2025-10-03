
import './App.css'
import HomePage from './pages/HomePage';
import MoviePage from './pages/MoviePage';
import { createBrowserRouter,RouterProvider } from 'react-router-dom';
import NotFoundPage from './pages/NotFoundPage';
import MovieDetailPage from './pages/MovieDetailPage';

const router = createBrowserRouter([
  {
    path:'/',
    element:<HomePage />,
    errorElement:<NotFoundPage/>,
    children:[
      {
        path:'movies/:category',
        element:<MoviePage/>,
      },
      {
        path:'movie/:movieId',
        element:<MovieDetailPage/>
      }
    ]
  }
]);

//upcoimg, populr, nowplaying등 여러 페이지를 받을 수 있음
//movies/category/{movie_id}


function App() { 
  return (
    <RouterProvider router={router}/>
  )
}

export default App;
