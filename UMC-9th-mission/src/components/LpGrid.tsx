import { useEffect, useState } from "react";
import useGetLpList from "../hooks/queries/useGetLpList";
import { PAGINATION_ORDER } from "../enums/common";
import LpCard from "./LpCard";
import LpListFallback from "./LpListFallback";

export default function LpGrid() {
  const cursor = undefined;
  const search = undefined;
  const [order, setOrder] = useState<PAGINATION_ORDER>(PAGINATION_ORDER.desc);

  const limit = 9;

  const { data, isLoading, error } = useGetLpList({ cursor, search, order, limit });

  useEffect(() => {
    console.log("LP 데이터:", data);
  }, [data]);

  const toggleOrder = () => {
    setOrder((prev) =>
    prev === PAGINATION_ORDER.desc
      ? PAGINATION_ORDER.asc
      : PAGINATION_ORDER.desc
  );
  };

{isLoading && <LpListFallback type="loading" />}
{error && <LpListFallback type="error" />}

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">LP 목록</h2>
        <button
          onClick={toggleOrder}
          className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 transition"
        >
          {order === "desc" ? "최신순 보기" : "오래된순 보기"}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {data?.map((lp: any) => (
          <LpCard key={lp.id} lp={lp} />
        ))}
      </div>
    </div>
  );
}
