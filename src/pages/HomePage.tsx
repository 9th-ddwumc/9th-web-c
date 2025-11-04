import useGetLpList from "../hooks/queries/useGetLpList";

const HomePage = () => {
  const { data, isPending, isError } = useGetLpList({});

  if (isPending) return <p className='text-white'>로딩 중...</p>;
  if (isError) return <p className='text-white'>에러 발생</p>;

  return (
    <div className="text-white">
      {data?.map((lp) => <p>{lp.title}</p>)}
    </div>
  );
};

export default HomePage;
