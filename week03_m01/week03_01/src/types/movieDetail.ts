export interface movieDetail {
    id: number;
    title: string;
    overview: string;
    poster_path: string;
    runtime: number;
    tagline: string;
    release_date: string;
    vote_average: number;
    genres: { id: number; name: string }[];
}
export interface CastMember {
    id: number;
    name: string;             
    character: string;        
}

// 크레딧 API 전체 응답 타입
export interface MovieCredits {
    id: number;
    cast: CastMember[]; // 배우 목록 (주로 이 부분을 사용)
    crew: { 
        id: number; 
        name: string;
        job: string;
        // ... 필요한 제작진 필드
    }[];
}
