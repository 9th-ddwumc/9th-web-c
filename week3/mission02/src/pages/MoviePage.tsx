import axios from "axios";
import { useEffect, useState } from "react"
import type { Movie, MovieResponse } from "../types/movie";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useParams } from "react-router-dom";
import Pagination from "../components/Pagination";
import MovieList from "../components/MovieList";




export default function MoviesPage () {
    const [movies,setMovies] = useState<Movie[]>([]);
    const[isPending, setIsPending] = useState(false);
    const[isError, setIsError] = useState(false);
    const [page, setPage] = useState(1);
    const [maxPage, setMaxPage] = useState(1);

    const {category}=useParams<{
        category:string;
    }>();

    useEffect(() => {
        const fetchMovies = async () => {
            setIsPending(true);
            try{
                const {data} = await axios.get<MovieResponse>(
                `https://api.themoviedb.org/3/movie/${category}?language=en-US&page=${page}`,
                {
                    headers: {
                        Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
                    },
                }
                );
                setMovies(data.results);
                setMaxPage(data.total_pages);
            }catch{
                setIsError(true);
            }finally{
                setIsPending(false);
            }
        };
        fetchMovies();
     
    }, [page, category]);

    if(isError){
        return <div>
            <span className="text-red-500 font-2xl">에러가 발생햇습니다.</span>
        </div>
    }

    return (
        <>
        <Pagination
            page={page}
            maxPage={maxPage}
            onPrev={() => setPage((prev) => prev - 1)}
            onNext={() => setPage((prev) => prev + 1)}
        />

        {isPending ? (
            <div className="flex items-center justify-center h-dvh">
            <LoadingSpinner />
            </div>
        ) : (
            <MovieList movies={movies} />
        )}
        </>
    );
}