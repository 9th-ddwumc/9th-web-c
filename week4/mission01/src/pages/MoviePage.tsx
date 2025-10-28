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

    const { data, isLoading, isError } = useCustomFetch<MovieResponse>( //영화 목록 API를 호출하여 data, isLoading, isError를 받음.
        `https://api.themoviedb.org/3/movie/${category}?language=en-US&page=${page}`, //category와 page를 포함해 TMDB API 호출.
        { headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}` } },
        [category, page] //둘 중 하나 바뀌면 재요청.
    );

    useEffect(() => { //data가 바뀌면 total_pages가 있으면 maxPage 업데이트.
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