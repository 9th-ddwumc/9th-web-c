import { useState } from 'react';
import type { MovieResponse } from '../types/movie';
import MovieCard from '../components/MovieCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useParams } from 'react-router-dom';
import useCustomFetch from '../hooks/useCustomFetch'

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_HEADERS = {
  Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
};

export default function MoviePage() {
  const [page, setPage] = useState(1);
  const { category } = useParams<{ category: string }>();

  const url = `${API_BASE_URL}/movie/${category}?language=ko-KR&page=${page}`;

  const { data, isPending, isError } = useCustomFetch<MovieResponse>(url, API_HEADERS);

  if (isError) {
    return (
      <div className='flex items-center justify-center h-dvh'>
        <span className='text-red-500 text-2xl'>에러가 발생했습니다.</span>
      </div>
    );
  }

  return (
    <>
      <div className='flex items-center justify-center gap-6 mt-5'>
        <button
          className='bg-[#8ACE00] text-white px-6 py-3 rounded-lg shadow-md
            hover:bg-[#b2dab1] transition-all duration-200 disabled:bg-gray-300
            cursor-pointer disabled:cursor-not-allowed'
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
        >
          {`<`}
        </button>
        <span className='text-white'>{page} 페이지</span>
        <button
          className='bg-[#8ACE00] text-white px-6 py-3 rounded-lg shadow-md
            hover:bg-[#b2dab1] transition-all duration-200 cursor-pointer'
          onClick={() => setPage((prev) => prev + 1)}
        >
          {`>`}
        </button>
      </div>

      {isPending && (
        <div className='flex items-center justify-center h-dvh'>
          <LoadingSpinner />
        </div>
      )}

      {!isPending && data && (
        <div className='p-10 grid gap-4 bg-gray-900
          grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
          {data.results.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </>
  );
}