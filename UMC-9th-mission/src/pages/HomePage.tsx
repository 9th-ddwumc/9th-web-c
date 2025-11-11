import { useEffect, useState } from "react";
import useGetInfiniteLpList from "../hooks/queries/useGetInfiniteLpList";
import { PAGINATION_ORDER } from "../enums/common";
import { useInView } from "react-intersection-observer";
import LpCardSkeletonList from "../components/LpCard/LpCardSkeletonList";
import LpCard from "../components/LpCard/LpCard";

//메인 홈페이지 컴포넌트
const HomePage = () => {
const [search, setSearch] = useState("");
//const {data, isPending, isError} = useGetLpList({})
const [order, setOrder] = useState<PAGINATION_ORDER>(PAGINATION_ORDER.desc);//초기값은 'desc'(최신순)
const {data:lps, isFetching, hasNextPage, isPending, fetchNextPage,  isError} = useGetInfiniteLpList(50, search,order);
    
//ref -> 특정한 HTML 요소를 감시할 수 있다.
//inView -> 그  요소가 화면에 보이면 true
const{ref, inView} = useInView({
    threshold :0,
});



useEffect(() => {
    if(inView){
        !isFetching && hasNextPage && fetchNextPage()
    }
},[inView,isFetching, hasNextPage, fetchNextPage])


if(isError){
    return <div className={"mt-20"}>error</div>
}


return  (
<>
    <div className="container mx-auto ps-4 py-6">
   
    {/* 검색 입력창 */}
    <input value={search} onChange={(e) => setSearch(e.target.value)}/>
    
    {/* 정렬 버튼 */}
    <div className="flex gap-2">
    <button
        onClick={() => setOrder(PAGINATION_ORDER.desc)} // 최신순
        className={`px-4 py-2 rounded ${
        order === PAGINATION_ORDER.desc
            ? "bg-pink-600 text-white"
            : "bg-gray-200 text-black"
        }`}
    >
        최신순
    </button>

    <button
        onClick={() => setOrder(PAGINATION_ORDER.asc)} // 오래된순
        className={`px-4 py-2 rounded ${
        order === PAGINATION_ORDER.asc
            ? "bg-pink-600 text-white"
            : "bg-gray-200 text-black"
        }`}
    >
        오래된순
    </button>
    </div>

        {/* LP 카드 그리드 */}
        <div className={"grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"}>
        {isPending && <LpCardSkeletonList count={20}/>}
        {/*불러온 LP 데이터(lps)를 렌더링*/}
        {lps?.pages
            ?.map((page) => page.data.data) // 각 페이지의 data 배열 꺼냄
            .flat() // 배열 합치기 [[1,2],[3,4]].flat() -> [1,2,3,4]
            .map((lp) => <LpCard key={lp.id} lp={lp}/>)}
            {isFetching&&<LpCardSkeletonList count={20}/>}
        </div>

        {/* 무한 스크롤 감지용 div */}
        <div ref={ref} className="h-2"></div>
    </div>
</>
);
}

export default HomePage;