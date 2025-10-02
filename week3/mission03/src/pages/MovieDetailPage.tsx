import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { LoadingSpinner } from "../components/LoadingSpinner";
import type { MovieCredits, MovieDetails } from "../types/movie";

export default function MovieDetailPage () {
    const {movieId}=useParams<{ movieId:string}>();
    const [movie,setMovie] = useState<MovieDetails|null>(null);
    const [credits,setCredits] = useState<MovieCredits|null>(null);
    const[isPending, setIsPending] = useState(false);
    const[isError, setIsError] = useState(false);

    

    useEffect(() => {
        const fetchMovieDetailAndCredit = async () => {
            setIsPending(true);
            try{
                const movieResponse = await axios.get<MovieDetails>(
                  `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`,
                  { 
                    headers: 
                    {
                        Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}` 
                    } 
                  }
                );
                const creditsResponse = await axios.get<MovieCredits>(
                  `https://api.themoviedb.org/3/movie/${movieId}/credits`,
                   { 
                    headers: 
                    { 
                      Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}` 
                    } 
                  }
                );
                
                setMovie(movieResponse.data);
                setCredits(creditsResponse.data);
            }catch{
                setIsError(true);
            }finally{
                setIsPending(false);
            }
        };
        fetchMovieDetailAndCredit();
     
    }, [movieId]);

    if(isError){
        return <div>
            <span className="text-red-500 font-2xl">에러가 발생햇습니다.</span>
        </div>
    }

    if (isPending || !movie || !credits) {
    return (
      <div className="flex items-center justify-center h-dvh">
        <LoadingSpinner />
      </div>
      );
    }

    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">{movie.title}</h1>
        <p className="mb-4">{movie.overview}</p>
        <p>개봉일: {movie.release_date}</p>
        <p>러닝타임: {movie.runtime}분</p>

        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-2">출연진</h2>
          <ul className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            {credits.cast.slice(0, 5).map((cast) => (
              <li key={cast.credit_id} className="text-sm">
                <p className="font-medium">{cast.name}</p>
                <p className="text-gray-400">{cast.character}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-2">제작진</h2>
          <ul className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            {credits.crew.slice(0, 5).map((crew) => (
              <li key={crew.credit_id} className="text-sm">
                <p className="font-medium">{crew.name}</p>
                <p className="text-gray-400">{crew.job}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
  );
}