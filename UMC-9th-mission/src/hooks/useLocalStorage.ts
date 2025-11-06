//값 저장 함수
export const useLocalStorage = (key:string) => {
    const setItem = (value:unknown) => {
        try{
            //localStorage는 문자열만 저장 가능하기 때문에, JSON.stringify()로 객체/배열 등을 문자열로 변환.
            window.localStorage.setItem(key, JSON.stringify(value));
        }catch (error){
            console.log(error);
        }
    };

    //값 가져오기 함수
    const getItem = () => {
        try{
            const item = window.localStorage.getItem(key);

            //저장된 문자열을 꺼내서 JSON.parse()로 다시 원래 객체 형태로 복원.
            return item ? JSON.parse(item) : null;
        }catch (e) {
            console.log(e);
        }
    };

    //값 삭제 함수
    const removeItem = () => {
        try{
            window.localStorage.removeItem(key);
        }catch (error){
            console.log(error);
        }
    };

    return {setItem, getItem, removeItem};
}