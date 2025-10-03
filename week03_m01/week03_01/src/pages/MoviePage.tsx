import { useEffect } from "react"
import axios from 'axios'
import { useState } from "react";
import type { Movie, MovieResponse } from '../types/movie';
import MovieCard from "../components/MovieCard";
import {LoadingSpinner} from"../components/LoadingSpinner";
import { useParams } from "react-router-dom";
//const TMDB_API_KEY = import.meta.env.VITE_TMDB_KEY;

export default function MoviePage(){
const [movies,setMovies] = useState<Movie[]>([]);
//로딩상태 만들기 
const [isPending, setIsPending]=useState(false);
//에러상태 만들기 
const [isError,setIsError]=useState(false);
//페이지처리
const [page,setPage]=useState(1);

const {category} = useParams<{
    category: string;
}>();

useEffect(()=>{
    const fetchMovies = async()=>{
        setIsPending(true);

        try{
        const {data} = await axios.get<MovieResponse>(`https://api.themoviedb.org/3/movie/${category}?language=en-US&page=${page}`,{
                headers:{
                    Authorization:`Bearer ${import.meta.env.VITE_TMDB_KEY}`,
                },
            }
        );
    
    setMovies(data.results);
    } catch{
     setIsError(true);
    }finally{
     setIsPending(false);
    }
    };

      fetchMovies();
},[page,category]);

if(isError){
    return (<div><span className='text-red-500 text2xl'>
        에러가 발생했습니다.</span></div>);
}

//if(!isPending){
  //  return <LoadingSpinner/> 여기에 하면 페이지 넘기는 버튼 사라짐;
//}

    return (
        <>
        <div className ='flex items-center justify-center gap-6 mt-5'>
            <button className='bg-[#dda5e3] text-white px-6 py-3 rounded-lg shadow-md hover:bg-[#b2dab1]
            transition-all duration=200 disabled:bg-gray-300
            cursor-pointer disabled:cursor-not-allowed'disabled={page===1}
            onClick={()=>setPage((prev)=>prev-1)}>
            {`<`}
            </button>
            <span>{page}페이지</span>
            <button className='bg-[#dda5e3] text-white px-6 py-3 rounded-lg shadow-md hover:bg-[#b2dab1]
            transition-all duration=200 cursor-pointer'
            onClick={()=>setPage((prev)=>prev+1)}>
            {`>`}
            </button>
        </div>
        {isPending&&(
            <div className='flex items-center justify-center h-dvh'>
                <LoadingSpinner/>
            </div>
        )}
       {!isPending &&(
         <div className='p-10 grid gap-4 -grid-cols-2 sm:grid-cols-3 md:frid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
        {movies.map((movie)=>(
            <MovieCard key ={movie.id} movie={movie}/>
        ))}
            </div>
       )}
        </>
);
}
