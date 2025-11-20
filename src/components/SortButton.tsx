import { PAGINATION_ORDER } from "../enums/common";

interface SortButtonProps {
  selectedOrder: PAGINATION_ORDER;
  onChangeOrder: (order: PAGINATION_ORDER) => void;
}

function SortButton({ selectedOrder, onChangeOrder }: SortButtonProps) {
  return (
    <div className='flex'>
      <button
        onClick={() => onChangeOrder(PAGINATION_ORDER.asc)}
        className={`px-3 py-1.5 rounded-l-full font-medium transition-colors ${
          selectedOrder === PAGINATION_ORDER.asc
            ? 'bg-white text-black'
            : 'bg-transparent text-white border border-gray-700 hover:border-gray-500'
        }`}
      >
        오래된순
      </button>

      <button
        onClick={() => onChangeOrder(PAGINATION_ORDER.desc)}
        className={`px-3 py-1.5 rounded-r-full font-medium transition-colors ${
          selectedOrder === PAGINATION_ORDER.desc
            ? 'bg-white text-black'
            : 'bg-transparent text-white border border-gray-700 border-l-0 hover:border-gray-500'
        }`}
      >
        최신순
      </button>
    </div>
  );
}

export default SortButton;
