import { Link } from "react-router-dom";

//웹사이트의 하단 영역(푸터)을 렌더링하는 컴포넌트
const Footer = () => {
    return (
    <footer className="bg-gray-100 dark:bg-gray-900 py-6 mt-12">
        {/* 저작권(Copyright) 정보를 표시하는 문단(paragraph)입니다. */}
        <div className="container mx-auto text-center text-gray-600 dark:text-gray-400">
            <p>
                &copy;{new Date(). getFullYear()}SpiningSpigning Dolimpan.All rights reserved.
            </p>

            {/* 개인정보처리방침, 서비스 약관 등의 링크들을 묶는 div입니다. */}
            <div className={"flex justify-center space-x-4 mt-4"}>
                <Link to={"#"}>Privacy Policy</Link>
                <Link to={"#"}>Terms of Service</Link>
                <Link to={"#"}>Contact</Link>
            </div>
        </div>
    </footer>
    )
};

export default Footer;