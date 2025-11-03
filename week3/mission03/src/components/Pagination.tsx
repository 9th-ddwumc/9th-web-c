interface PaginationProps {
    page:number;
    maxPage: number;
    onPrev: () => void;
    onNext: () => void;
}

export default function Pagination({page, maxPage, onPrev, onNext}: PaginationProps){
    const baseBtnClass = 'bg-[#dda5e3] text-white px-6 py-3 rounded-lg shadow-md hover:bg-[#b2dab1] transition-all duration-200 cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed';

    return(
        <div className='flex items-center justify-center gap-6 mt-5'>
                       <button 
                           className={baseBtnClass}
                           disabled={page ===1} 
                           onClick={onPrev}>
                            {`<`}
                       </button>
                       <span>{page} 페이지</span>
                       <button 
                           className={baseBtnClass}
                            disabled={page === maxPage}
                           onClick={onNext}>
                            {`>`}
                       </button>
                   </div>
    )
}
