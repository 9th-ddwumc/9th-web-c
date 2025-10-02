import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import type { MovieDetail } from "../types/movieDetail";
import { LoadingSpinner } from "../components/LoadingSpinner";

export default function MovieDetailPage() {
  const { movieId } = useParams<{ movieId: string }>();
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchMovieDetail = async () => {
        setIsPending(true);
      try {
        const { data } = await axios.get<MovieDetail>(
          `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
            },
          }
        );
        setMovie(data);
      } catch (error) {
        setIsError(true);
      } finally {
        setIsPending(false);
      }
    };

    fetchMovieDetail();
  }, [movieId]);

  if (isPending) {
  return (
    <div className="flex justify-center items-center h-[70vh]">
      <LoadingSpinner />
    </div>
  );
}

if (isError) {
  return (
    <div className="text-center text-red-500 text-2xl mt-10">
      에러가 발생했습니다.
    </div>
  );
}

if (!movie) {
  return (
    <div className="text-center text-gray-500 mt-10">
      영화 정보를 불러올 수 없습니다.
    </div>
  );
}

  return (
  <div
  className="relative bg-gray-900 text-white min-h-[91vh]"
  style={{
    backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
    backgroundSize: '100% auto',
    backgroundPosition: 'top',
    backgroundRepeat: 'no-repeat',
  }}
  >
  
    <div
    className="absolute inset-0"
    style={{
      background: 'linear-gradient(to right, rgba(0, 0, 0, 1), rgba(25, 25, 25, 0.5))',
    }}
  ></div>


  <div className="relative p-5 pl-10 gap-6 w-1/3">
    
    <button className="pr-5 pl-5 text-3xl font-bold p-2 rounded-full 
    bg-gray-800 hover:bg-blue-300 transition-colors hover:cursor-pointer"
    onClick={() => window.history.back()}>
    {'<'}
    </button>

    <div className="mt-5">

      <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
      <p className="mt-2 text-gray-300 text-sm font-bold mb-4">
        개봉일: {movie.release_date} / 평점: {movie.vote_average}
      </p>
      <p className="text-sm md:text-base">{movie.overview}</p>
    </div>
  </div>
</div>

  );
}
