import { useParams } from "react-router-dom";
import type { MovieCreditsResponse, MovieDetail } from "../types/movieDetail";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useCustomFetch } from "../hooks/useCustomFetch";

export default function MovieDetailPage() {
  const { movieId } = useParams<{ movieId: string }>();

  // 🎬 영화 상세 데이터
  const {
    data: movieData,
    isPending: isMoviePending,
    isError: isMovieError,
  } = useCustomFetch<MovieDetail>(
    `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`,
    [movieId]
  );

  // 🎭 출연진 데이터
  const {
    data: creditData,
    isPending: isCreditPending,
    isError: isCreditError,
  } = useCustomFetch<MovieCreditsResponse>(
    `https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`,
    [movieId]
  );

  // 로딩/에러 통합 상태
  const isPending = isMoviePending || isCreditPending;
  const isError = isMovieError || isCreditError;

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

  // 영화 데이터가 없을 경우
  if (!movieData) {
    return (
      <div className="text-center text-gray-500 mt-10">
        영화 정보를 불러올 수 없습니다.
      </div>
    );
  }

  // 감독 필터링
  const directors =
    creditData?.crew.filter((person) => person.job === "Director") || [];

  return (
    <div
  className="relative bg-gray-900 text-white min-h-screen"
  style={{
    backgroundImage: `url(https://image.tmdb.org/t/p/original${movieData.backdrop_path})`,
    backgroundSize: "cover",
    backgroundPosition: "top",
    backgroundRepeat: "no-repeat",
    minHeight: "75vh",
  }}
>
  {/* 배경 오버레이 */}
  <div
    className="absolute inset-0"
    style={{
      background:
        "linear-gradient(to right, rgba(0, 0, 0, 1), rgba(25, 25, 25, 0.5))",
    }}
  ></div>

  {/* 본문 */}
  <div className="relative z-10 flex flex-col md:flex-row p-5 md:p-10 gap-6 items-start">
    
    {/* 왼쪽: 영화 정보 */}
    <div className="flex-shrink-0 md:w-1/3 min-w-[320px]">
      <button
        className="pr-5 pl-5 text-3xl font-bold p-2 rounded-full 
        bg-gray-800 hover:bg-blue-300 transition-colors hover:cursor-pointer"
        onClick={() => window.history.back()}
      >
        {"<"}
      </button>

      <div className="mt-5">
        <h1 className="text-4xl font-bold mb-4">{movieData.title}</h1>
        <p className="mt-2 text-gray-300 text-sm font-bold mb-4">
          개봉일: {movieData.release_date} / 평점: {movieData.vote_average}
        </p>
        <p className="text-sm md:text-base mb-6 line-clamp-5">{movieData.overview}</p>

        {/* 감독 */}
        {directors.length > 0 && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4">감독</h2>
            <div className="flex flex-wrap gap-4">
              {directors.map((director) => (
                <div key={director.id} className="flex items-center space-x-2">
                  {director.profile_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w200${director.profile_path}`}
                      alt={director.name}
                      className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-full"
                    />
                  ) : (
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-700 flex items-center justify-center rounded-full">
                      <span className="text-gray-400 text-xs">No Image</span>
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-sm md:text-base">{director.name}</p>
                    <p className="text-gray-400 text-xs md:text-sm">{director.job}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 출연진 */}
        {creditData && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4">출연진</h2>
            <div className="grid grid-cols-2 gap-2 md:gap-4">
              {creditData.cast.slice(0, 6).map((cast) => (
                <div key={cast.id} className="flex items-center space-x-2">
                  {cast.profile_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w200${cast.profile_path}`}
                      alt={cast.name}
                      className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-full"
                    />
                  ) : (
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-700 flex items-center justify-center rounded-full">
                      <span className="text-gray-400 text-xs">No Image</span>
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-xs md:text-sm">{cast.name}</p>
                    <p className="text-gray-400 text-xs md:text-sm">{cast.character}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>

    {/* 오른쪽 빈 영역 (큰 화면에서 이미지 배경만 보여주도록) */}
    <div className="hidden md:flex flex-1"></div>
  </div>
</div>

  );
}
