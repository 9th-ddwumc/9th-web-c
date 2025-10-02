import axios from "axios";
import { useEffect, useState } from "react"
import type { Movie, MovieResponse } from "../types/movie";
import MovieCard from "../components/MovieCard";



export default function MoviesPage () {
    const [movies,setMovies] = useState<Movie[]>([])
    const [isPending, setIsPending] = useState(false);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const fetchMovies = async () => {
            setIsPending(true);
            setIsError(false);
            try {
                const { data } = await axios.get<MovieResponse>(
                    "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1",
                    {
                        headers: {
                            Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
                        },
                    }
                );
                setMovies(data.results);
            } catch (err) {
                setIsError(true);
            } finally {
                setIsPending(false);
            }
        };
        fetchMovies();
    }, []);
    
    if (isPending) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="text-lg font-semibold">로딩 중</span>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="text-red-500 font-semibold">
                    에러가 발생했습니다. 다시 시도해주세요.
                </span>
            </div>
        );
    }


    return (
    <div className='p-10 grid gap-4 grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
        {movies &&
            movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie}/>
           ))}
    </div>
    );
}