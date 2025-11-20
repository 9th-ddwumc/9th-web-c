import { useState } from "react";
import { PAGENATION_ORDER } from "../enums/common";

interface OrderButtonProps {
  order?: PAGENATION_ORDER; // ✅ optional로 변경
  setOrder?: React.Dispatch<React.SetStateAction<PAGENATION_ORDER>>;
}

export const OrderButton = ({
  order: externalOrder,
  setOrder: externalSetOrder,
}: OrderButtonProps) => {
  // ✅ props 없으면 내부 상태로 오래된 순(default)
  const [internalOrder, setInternalOrder] = useState<PAGENATION_ORDER>(
    PAGENATION_ORDER.asc
  );

  const order = externalOrder ?? internalOrder;
  const setOrder = externalSetOrder ?? setInternalOrder;

  return (
    <div className="flex justify-end w-full mb-4 mt-4">
      <div className="flex border border-gray-600 rounded-lg overflow-hidden w-48 text-sm font-bold">
        <button
          onClick={() => setOrder(PAGENATION_ORDER.asc)}
          className={`flex-1 px-4 py-2 transition-colors duration-200 ${
            order === PAGENATION_ORDER.asc
              ? "bg-white text-black"
              : "bg-black text-white hover:bg-gray-900"
          }`}
        >
          오래된 순
        </button>
        <button
          onClick={() => setOrder(PAGENATION_ORDER.desc)}
          className={`flex-1 px-4 py-2 transition-colors duration-200 ${
            order === PAGENATION_ORDER.desc
              ? "bg-white text-black"
              : "bg-black text-white hover:bg-gray-900"
          }`}
        >
          최신순
        </button>
      </div>
    </div>
  );
};
