import { useEffect } from "react";
import { useParams } from "react-router-dom";

const MovieDetailPage = ()=>{
    const params = useParams();

    console.log(params);
    return<div>MovieDatailPage{params.movieId}</div>;
};


export default MovieDetailPage;