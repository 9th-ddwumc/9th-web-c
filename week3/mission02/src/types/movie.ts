export type Movie ={
    adult:boolean;
    backdrop_path:string; 
    genre_ids:number[];
    id:number;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    release_date: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count:number;
}

export type MovieResponse = {
    page:number;
    results:Movie[];
    total_pages:number;
    total_results:number;
}

export interface MovieDetails{
  adult: boolean;
  backdrop_path: string | null; 
  belongs_to_collection: string | null;
  budget: number;
  genres: { id: number; name: string }[];
  id: number;
  imdb_id: string;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  release_date: string;
  runtime: number;
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
};

export interface Credits{
    id: number;
    cast: 
    {
      adult:boolean;
      gender: number;
      id: number;
      name:string;
      original_name: string;
      profile_path: string| null;
      cast_id:number;
      character:string|null;
      credit_id:string;
      order:number|null;
       department:string|null;
      job: string|null;
    }[];
}