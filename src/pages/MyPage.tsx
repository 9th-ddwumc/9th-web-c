import { useEffect, useState } from "react";
import { getMyInfo } from "../apis/auth";
import type { ResponseMyInfoDto } from "../types/auth";

export const MyPage = () => {
  const [data, setData] = useState<ResponseMyInfoDto | null>(null);

  useEffect(() => {
    const getData = async () => {
        const response = await getMyInfo();
        console.log(response);

        setData(response);
    };

    getData();
  }, []);
  
  if (!data) return <div>로딩 중...</div>;
  
  return <div>{data.data.name} 님 반갑습니다.</div>;
};

export default MyPage;