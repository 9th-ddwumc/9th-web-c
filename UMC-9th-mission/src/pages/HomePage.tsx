import LpGrid from "../components/LpGrid";
import useGetLpList from "../hooks/queries/useGetLpList";


const HomePage = () => {
    const {data, isPending, isError} = useGetLpList({})

    if(isPending){
        return<div className={"mt-20"}>Loading....</div>
    }
    if(isError){
        return <div className={"mt-20"}>error</div>
    }
    return  <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">추천 LP</h1>
      <LpGrid />
    </div>
}

export default HomePage;