import { useEffect, useState } from "react"
import axios from 'axios';
import MovieCard from "../components/MovieCard";
import type { Movie, MovieResponse } from "../types/movie";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useParams } from "react-router-dom";


export default function MoviePage() {
    const [movies, setMovies] = useState<Movie[]>([]);

    const [isPending, setIsPending] = useState(false);
    const [isError, setIsError] = useState(false);
    const [page, setPage] = useState(1);

    const {category} = useParams<{
        category: string
    }>();

    useEffect(() => {
        const fetchMovies = async() => {
                setIsPending(true);

                try {
                    const {data} = await axios.get<MovieResponse>(
                    `https://api.themoviedb.org/3/movie/${category}?language=ko-KR&page=${page}`
                    ,{
                        headers: {
                            Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
                        },
                    }
                );
                setMovies(data.results);
            } catch {
                setIsError(true);
            } finally {
                setIsPending(false);
            }
            
        };
        fetchMovies();

        
    },[page, category]);

    if (isError) {
        return (
            <div>
                <span className='text-red-500 text-2xl'>에러가 발생했습니다.</span>
            </div>
        );
    }

    return (
        <>
            <div className="bg-gray-900">
                <div className='flex items-center justify-center gap-6'>
                    <button
                        className="m-4 px-4 py-2 bg-blue-400 text-white font-bold rounded hover:bg-blue-200 disabled:bg-gray-500
                        transition-all duration-200 disabled:cursor-not-allowed cursor-pointer"
                        onClick={() => setPage((prev) => prev - 1)}
                        disabled={page === 1}>{`<`}</button>
                    <span className='text-white font-bold'>{page} 페이지</span>
                    <button
                        className="m-4 px-4 py-2 bg-blue-400 text-white font-bold rounded hover:bg-blue-200
                        transition-all duration-200 cursor-pointer"
                        onClick={() => setPage((prev) => prev + 1)}>{`>`}</button>
                </div>

                {isPending && (
                    <div className='flex justify-center items-center h-[81vh]'>
                        <LoadingSpinner />
                    </div>
                )}

                {!isPending && (
                    <div className='p-10 grid gap-8 grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
                    {movies.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                    </div>
                )}
            </div>
            
            
        </>
        
    )

}