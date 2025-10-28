//import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import type { Movie, MovieResponse } from "../types/movie";

const MoviesPage = () => {
   /* const params = useParams();
    console.log(params);
    return <h1>{params.movieId}번의 Moives Page 야호~!</h1>*/

    const [movies, setMovies] = useState<Movie[]>([]);

    console.log(movies);

    useEffect(() => {
        const fetchMovies = async () => {
            const {data} = await axios.get<MovieResponse>('https://api.themoviedb.org/3/movie/popular?language=en-US&page=1',
                {
                    headers: {
                        Authorization:`Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlMjg0MDQwMGEzMzI0OTZlNzhlYjVlMTM0OTE2YTkyZiIsIm5iZiI6MTc1OTExNzI5Ny41NjA5OTk5LCJzdWIiOiI2OGQ5ZmZmMTMyZmUxNDdlZTdlMWM5NTIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.vCfmxfTZJ_gJIrA-CuH20bGr11q3z-jM3zFJjbOFhok`,
                    },
                },
            );
            setMovies(data.results);
        };
        fetchMovies();
    }, []);
    
    return (
        <ul>
            {movies?.map((movie) => (
                <li key={movie.id}>
                    <h2>{movie.title}</h2>
                    <p>{movie.release_date}</p>
                </li>
            ))}
        </ul>
    )
};

export default MoviesPage;