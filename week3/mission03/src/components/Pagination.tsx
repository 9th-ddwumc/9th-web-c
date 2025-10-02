interface PaginationProps {
    page:number;
    onPrev: () => void;
    onNext: () => void;
}

export default function Pagination({page, onPrev, onNext}: PaginationProps){
    return(
        <div className='flex items-center justify-center gap-6 mt-5'>
                       <button 
                           className='bg-[#dda5e3] text-white px-6 py-3 rounded-lg shadow-md 
                           hover:bg-[#b2dab1] transition-all duration-200 disabled:bg-gray-300
                           cursor-pointeer disabled:cursor-not-allowed'
                           disabled={page ===1} 
                           onClick={onPrev}>{`<`}
                       </button>
                       <span>{page} 페이지</span>
                       <button 
                           className='bg-[#dda5e3] text-white px-6 py-3 rounded-lg shadow-md 
                           hover:bg-[#b2dab1] transition-all duration-200 cursor-pointer'
                           onClick={onNext}>{`>`}
                       </button>
                   </div>
    )
}