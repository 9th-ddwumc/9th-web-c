import type { Movie, MovieResponse } from "../types/movie";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useParams } from "react-router-dom";
import Pagination from "../components/Pagination";
import MovieList from "../components/MovieList";
import useCustomFetch from "../hooks/useCustomFetch";
import { useEffect, useState } from "react";




export default function MoviesPage () {
    const [page, setPage] = useState(1);
    const [maxPage, setMaxPage] = useState(1);

    const {category}=useParams<{
        category:string;
    }>();

    const { data, isLoading, isError } = useCustomFetch<MovieResponse>(
        `https://api.themoviedb.org/3/movie/${category}?language=en-US&page=${page}`,
        { headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}` } },
        [category, page]
    );

    useEffect(() => {
        if (data?.total_pages) setMaxPage(data.total_pages);
     }, [data]);

    if (isError) {
        return (
        <div>
            <span className="text-red-500 font-2xl">에러가 발생했습니다.</span>
        </div>
        );
     }

    return (
        <>
        <Pagination
            page={page}
            maxPage={maxPage}
            onPrev={() => setPage((prev) => prev - 1)}
            onNext={() => setPage((prev) => prev + 1)}
        />

        {isLoading ? (
            <div className="flex items-center justify-center h-dvh">
            <LoadingSpinner />
            </div>
        ) : (
            <MovieList movies={data?.results || []} />
        )}
        </>
    );
}