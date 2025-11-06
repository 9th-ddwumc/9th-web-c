import { useEffect, useState } from "react";
import { getMyInfo } from "../apis/auth";
import type { ResponseMyInfoDto } from "../types/auth";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const MyPage = () => {
    const [data, setData] = useState<ResponseMyInfoDto>([]);
    const{logout} = useAuth()
    const navigate = useNavigate();
    useEffect(() => {
    const getData = async () => {
        try {
            const response = await getMyInfo();
            console.log("getMyInfo response:", response);
            setData(response);
        } catch (err) {
            console.error("getMyInfo error:", err);
        }
    };
    getData();
}, []);

    return (<div className="h-screen pt-20">
    <h1>{data.data?.name}님 환영합니다.</h1>
    <h1>{data.data?.email}</h1>

    </div>);
};

export default MyPage;