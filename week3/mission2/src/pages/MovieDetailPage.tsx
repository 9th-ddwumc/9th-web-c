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
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">{movie.title}</h1>
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        className="rounded-xl shadow-lg mb-6"
      />
      <p>{movie.overview}</p>
      <p className="mt-4 text-sm text-gray-500">
        개봉일: {movie.release_date} / 평점: {movie.vote_average}
      </p>
    </div>
  );
}
