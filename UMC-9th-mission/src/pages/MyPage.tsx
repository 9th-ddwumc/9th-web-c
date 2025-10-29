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
       
        const getData = async() => {
            const response = await getMyInfo();
            console.log(response);
            
            setData(response);
        }
        getData();
    }, [])

    const handleLogout = async() => {
        await logout();
        navigate('/');
    }
    return (<>
    <h1>{data.data?.name}님 환영합니다.</h1>
    <h1>{data.data?.email}</h1>

    <button className='cursor-pointer bg-blue-300 rounded-sm p-5 hover:scale-90' onClick={handleLogout}>로그아웃</button>
    </>);
};

export default MyPage;