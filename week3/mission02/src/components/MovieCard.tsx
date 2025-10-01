import { useState } from "react";
import type { Movie } from "../types/movie"
import { useNavigate } from "react-router-dom";

interface MovieCardProps{
    movie:Movie
}

export default function MovieCard ({movie}: MovieCardProps) {
    const [isHovered, setIsHoverd] = useState(false);
    const navigate = useNavigate();

    return (
    <div 
        onClick={() => navigate('/movies/${movie.id}')}
        className='relative rounded-xl shadow-lg ovorflow-hidden cursor-pointer w-44
        tansition-transform duration-500 hover:scale-105' 
        onMouseEnter={() => setIsHoverd(true)}
        onMouseLeave={() => setIsHoverd(false)}
    >
        <img 
            src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
            alt={`${movie.title}영화의 이미지`}
            className=''
        />

        {isHovered && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 
            to-transparent backdrop-blur-md flex flex-col justify-center     
            p-4 text-white">
                <h2 className='text-lg font-bold leading-sung'>{movie.title}</h2>
                <p className="text-sm text-gray-300 leading-relaxed mt-2 line-clamp-5">{movie.overview}</p>
            </div>
        )}
    </div>
    );
}