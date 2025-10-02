import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LoadingSpinner } from '../components/LoadingSpinnier';
import type { MovieDetail, Credits } from '../types/movieDetail';

export default function MovieDetailPage() {
  const { movieId } = useParams<{ movieId: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [credits, setCredits] = useState<Credits | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchMovieDetail = async (): Promise<void> => {
      setIsPending(true);
      try {
        const [movieResponse, creditsResponse] = await Promise.all([
          axios.get<MovieDetail>(
            `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`,
            {
              headers: {
                Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
              },
            }
          ),
          axios.get<Credits>(
            `https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`,
            {
              headers: {
                Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
              },
            }
          ),
        ]);
        setMovie(movieResponse.data);
        setCredits(creditsResponse.data);
      } catch {
        setIsError(true);
      } finally {
        setIsPending(false);
      }
    };

    if (movieId) {
      fetchMovieDetail();
    }
  }, [movieId]);

  if (isPending) {
    return (
      <div className='flex items-center justify-center h-dvh'>
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className='flex items-center justify-center h-dvh'>
        <span className='text-red-500 text-2xl'>에러가 발생했습니다.</span>
      </div>
    );
  }

  if (!movie || !credits) {
    return null;
  }

  const directors = credits.crew.filter(person => person.job === 'Director');
  const topCast = credits.cast.slice(0, 8);

  return (
    <div className='min-h-screen text-white pb-10'>
      {/* 배경 이미지 */}
      <div className='relative w-full h-96 overflow-hidden'>
        <div
          className='absolute inset-0 bg-cover bg-center'
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
          }}
        >
          <div className='absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/70 to-gray-900' />
        </div>
      </div>

      {/* 영화 정보 */}
      <div className='container mx-auto px-4 -mt-64 relative z-10'>
        <div className='max-w-4xl'>
          <button
            onClick={() => navigate(-1)}
            className='mb-4 px-4 py-2 bg-[#8ACE00] hover:bg-[#b2dab1] rounded-lg 
              transition-all duration-200 cursor-pointer'
          >
            ← 뒤로 가기
          </button>

          <h1 className='text-4xl font-bold mb-2'>{movie.title}</h1>
          
          {movie.tagline && (
            <p className='text-gray-400 italic mb-4'>{movie.tagline}</p>
          )}

          <div className='flex flex-wrap gap-4 mb-6'>
            <div className='flex items-center gap-2'>
              <span className='text-yellow-400'>⭐</span>
              <span className='font-semibold'>{movie.vote_average.toFixed(1)}</span>
            </div>
            
            <div className='text-gray-300'>
              {movie.release_date} 개봉
            </div>
            
            {movie.runtime > 0 && (
              <div className='text-gray-300'>
                {Math.floor(movie.runtime / 60)}시간 {movie.runtime % 60}분
              </div>
            )}
          </div>

          {/* 장르 */}
          <div className='flex flex-wrap gap-2 mb-6'>
            {movie.genres.map((genre) => (
              <span
                key={genre.id}
                className='px-3 py-1 bg-gray-800 rounded-full text-sm'
              >
                {genre.name}
              </span>
            ))}
          </div>

          {/* 줄거리 */}
          <div className='mb-8'>
            <h2 className='text-2xl font-bold mb-3'>줄거리</h2>
            <p className='text-gray-300 leading-relaxed'>
              {movie.overview || '줄거리 정보가 없습니다.'}
            </p>
          </div>

          {/* 감독 */}
          {directors.length > 0 && (
            <div className='mb-8'>
              <h2 className='text-2xl font-bold mb-3'>감독</h2>
              <div className='flex flex-wrap gap-3'>
                {directors.map((director) => (
                  <span key={director.id} className='text-gray-300 text-lg'>
                    {director.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 출연 배우 */}
          <div className='mb-8'>
            <h2 className='text-2xl font-bold mb-4'>출연</h2>
            <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4'>
              {topCast.map((actor) => (
                <div key={actor.id} className='text-center'>
                  <div className='mb-2 rounded-full overflow-hidden bg-gray-800 w-24 h-24 mx-auto'>
                    {actor.profile_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                        alt={actor.name}
                        className='w-full h-full object-cover'
                      />
                    ) : (
                      <div className='w-full h-full flex items-center justify-center bg-gray-700'>
                        <span className='text-gray-500 text-xs'>No Image</span>
                      </div>
                    )}
                  </div>
                  <p className='font-semibold text-xs truncate'>{actor.name}</p>
                  <p className='text-xs text-gray-400 truncate'>{actor.character}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}