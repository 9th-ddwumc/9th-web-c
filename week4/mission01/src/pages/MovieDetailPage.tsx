import { useParams } from "react-router-dom";
import { LoadingSpinner } from "../components/LoadingSpinner";
import type { MovieCredits, MovieDetails } from "../types/movie";
import useCustomFetch from "../hooks/useCustomFetch";


export default function MovieDetailPage () {
     const { movieId } = useParams<{ movieId: string }>();

  const { data: movie, isLoading: movieLoading, isError: movieError } =
    useCustomFetch<MovieDetails>( //영화 상세 정보(MovieDetails)를 가져옴. movie, movieLoading, movieError로 이름을 바꿔서 받음.
      `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`, //요청 URL에 movieId 삽입, language=en-US 포함.
      { headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}` } },
      [movieId]
    );

  const { data: credits, isLoading: creditsLoading, isError: creditsError } =
    useCustomFetch<MovieCredits>( //useCustomFetch — 해당 영화의 크레딧(출연진/제작진)을 가져옴. credits, creditsLoading, creditsError.
      `https://api.themoviedb.org/3/movie/${movieId}/credits`,
      { headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}` } },
      [movieId]
    );

    if(movieError || creditsError){
        return <div>
            <span className="text-red-500 font-2xl">에러가 발생햇습니다.</span>
        </div>
    }

    if (movieLoading || creditsLoading || !movie || !credits) {
    return (
      <div className="flex items-center justify-center h-dvh">
        <LoadingSpinner />
      </div>
      );
    }


    return  (
    <div className="relative min-h-screen text-gray-100">
     
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.9)), url('https://image.tmdb.org/t/p/original${movie.backdrop_path || movie.poster_path}')`,
        }}
      ></div>

      
      <div className="relative z-10 max-w-6xl mx-auto p-6 sm:p-10">
    
        <div className="mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">{movie.title}</h1>
          <p className="text-gray-200 mb-4">{movie.overview}</p>
          <div className="flex flex-wrap gap-6 text-gray-300">
            <p>
              <span className="font-semibold">개봉일:</span> {movie.release_date}
            </p>
            <p>
              <span className="font-semibold">러닝타임:</span> {movie.runtime}분
            </p>
          </div>
        </div>

        
        <section className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-4">출연진</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {credits.cast.slice(0, 5).map((cast) => (
              <div
                key={cast.credit_id}
                className="bg-gray-800 bg-opacity-70 rounded-lg p-4 text-center shadow hover:shadow-lg transition-shadow"
              >
                <img
                  src={
                    cast.profile_path
                      ? `https://image.tmdb.org/t/p/w200${cast.profile_path}`
                      : "https://via.placeholder.com/200x300?text=No+Image"
                  }
                  alt={cast.name}
                  className="w-full h-48 object-cover rounded-lg mb-3"
                />
                <p className="font-medium">{cast.name}</p>
                <p className="text-gray-400 text-sm">{cast.character}</p>
              </div>
            ))}
          </div>
        </section>

      
        <section>
          <h2 className="text-2xl sm:text-3xl font-semibold mb-4">제작진</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {credits.crew.slice(0, 5).map((crew) => (
              <div
                key={crew.credit_id}
                className="bg-gray-800 bg-opacity-70 rounded-lg p-4 text-center shadow hover:shadow-lg transition-shadow"
              >
                <img
                  src={
                    crew.profile_path
                      ? `https://image.tmdb.org/t/p/w200${crew.profile_path}`
                      : "https://via.placeholder.com/200x300?text=No+Image"
                  }
                  alt={crew.name}
                  className="w-full h-48 object-cover rounded-lg mb-3"
                />
                <p className="font-medium">{crew.name}</p>
                <p className="text-gray-400 text-sm">{crew.job}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}