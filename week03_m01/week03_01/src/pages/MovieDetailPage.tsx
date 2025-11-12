import { useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import axios from 'axios';
import { LoadingSpinner } from "../components/LoadingSpinner";
import type{movieDetail, CastMember,MovieCredits} from "../types/movieDetail";


export default function MovieDetailPage(){

    const [movie, setMovie] = useState<movieDetail | null>(null);
    const[cast,setCast]=useState<CastMember[]>([]);

    const [isPending, setIsPending] = useState(true);
    const [isError, setIsError] = useState(false);

    //구조 분해 할당
    const { movieId } = useParams<{ movieId: string }>();

        useEffect(() => {
        if (!movieId) {
            setIsError(true);
            setIsPending(false);
            return;
        }

        const fetchMovieData = async () => { // 함수 이름을 detail에서 data로 변경 (두 개를 가져오므로)
            setIsPending(true);
            setIsError(false);
            setMovie(null);
            setCast([]); 

            try {
                const headers = { Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}` };

                //영화정보
                const moviePromise = axios.get<movieDetail>(
                    `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`,
                    { headers }
                );

                //배우정보
                const creditsPromise = axios.get<MovieCredits>(
                    `https://api.themoviedb.org/3/movie/${movieId}/credits`,
                    { headers }
                );

                // Promise.all로 두 요청을 동시에 처리
                const [movieResponse, creditsResponse] = await Promise.all([moviePromise, creditsPromise]);
                
                // 영화 상세 정보 저장
                setMovie(movieResponse.data);
                
                // 배우 10명만 목록에 저장 
                setCast(creditsResponse.data.cast.slice(0, 10)); 

            } catch (error) {
                setIsError(true);
            } finally {
                setIsPending(false);
            }
        };

        fetchMovieData();
    }, [movieId]); // movieId가 바뀔 때마다 재호출
    //로딩, 에러 상태 
    if (isPending) {
        return <div className='flex justify-center mt-20 h-screen'><LoadingSpinner /></div>;
    }

    if (isError || !movie) {
        return <div className='p-10 text-center text-red-500 text-xl'>영화 정보를 찾을 수 없거나 로딩에 실패했습니다.</div>;
    }

   //포스터, 상세정보 
    return (
        <div className="p-10 max-w-6xl mx-auto">
            <h1 className="text-4xl font-extrabold mb-2">{movie.title}</h1>
            <p className="text-xl italic text-gray-500 mb-6">{movie.tagline}</p>
            
            <div className="flex flex-wrap md:flex-nowrap gap-10">
                {movie.poster_path && (
                    <img 
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                        alt={movie.title} 
                        className="w-full md:w-80 h-auto rounded-lg shadow-xl shrink-0"
                    />
                )}
                
                <div className="flex-1">
                    <div className="mt-4 space-y-3">
                        <p><strong>개봉일:</strong> {movie.release_date}</p>
                        <p><strong>평점:</strong> <span className="text-lg text-green-600 font-bold">{movie.vote_average.toFixed(1)}</span> / 10</p>
                        <p><strong>상영 시간:</strong> {movie.runtime} 분</p>
                        <p><strong>장르:</strong> {movie.genres.map(g => g.name).join(', ')}</p>
                    </div>
                    <h2 className="text-2xl font-semibold mb-3 border-b pb-1">줄거리</h2>
                    <p className="text-gray-700 mb-6 leading-relaxed">{movie.overview}</p>
                    
                </div>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
                        {cast.length > 0 ? (
                            cast.map((actor, index) => (
                                <span 
                                    key={actor.id || index} 
                                    className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-800"
                                >
                                    {actor.name} ({actor.character})
                                </span>
                            ))
                        ) : (
                            <p className="text-gray-500">출연진 정보가 없습니다.</p>
                        )}
                    </div>
        </div>
    );
}