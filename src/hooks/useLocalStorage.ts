export const useLocalStorage = (key: string) => {
    const setItem = (value: string) => {  // value 타입을 string으로 제한
        try {
            window.localStorage.setItem(key, value); // JSON.stringify 제거
        } catch (error) {
            console.log(error);
        }
    }

    const getItem = () => {
        try {
            const item = window.localStorage.getItem(key);
            return item ?? null; // 그대로 반환, JSON.parse 제거
        } catch (e) {
            console.log(e);
        }
    }

    const removeItem = () => {
        try{
            window.localStorage.removeItem(key);
        } catch (error) {
            console.log(error);
        }
    }

    return {setItem, getItem, removeItem};
}
