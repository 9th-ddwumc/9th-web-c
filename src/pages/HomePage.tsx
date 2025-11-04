import useGetLpList from "../hooks/queries/useGetLpList";

const HomePage = () => {
  const { data, isPending, isError } = useGetLpList({});

  if (isPending) return <p className='text-white p-8'>로딩 중...</p>;
  if (isError) return <p className='text-white p-8'>에러 발생</p>;

  return (
    <div className='p-8'>
      <div className='flex gap-4 mb-6 justify-end'>
        <button className='px-4 py-2 bg-white text-black rounded-full font-medium'>
          오래된순
        </button>
        <button className='px-4 py-2 bg-transparent text-white border border-gray-700 rounded-full'>
          최신순
        </button>
      </div>
      
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
        {data?.map((lp) => (
          <div key={lp.id} className='group cursor-pointer'>
            <div className='aspect-square bg-gray-800 rounded overflow-hidden mb-2'>
              {lp.thumbnail ? (
                <img 
                  src={lp.thumbnail} 
                  alt={lp.title}
                  className='w-full h-full object-cover group-hover:scale-105 transition-transform'
                />
              ) : (
                <div className='w-full h-full flex items-center justify-center text-gray-600'>
                  No Image
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;