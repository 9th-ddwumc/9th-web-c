import axios from "axios";
import { useEffect, useState } from "react"
import type { Movie, MovieResponse } from "../types/movie";
import MovieCard from "../components/MovieCard";



export default function MoviesPage () {
    const [movies,setMovies] = useState<Movie[]>([])

    useEffect(() => {
        const fetchMovies = async () => {
            const {data} = await axios.get<MovieResponse>(
            "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1",
            {
                headers: {
                    Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
                },
            }
            );
          setMovies(data.results);
        };
        fetchMovies();
    }, []);

    return (
    <div className='p-10 grid gap-4 grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
        {movies &&
            movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie}/>
           ))}
    </div>
    );
}