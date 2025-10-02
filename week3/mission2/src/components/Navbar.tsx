import { NavLink } from "react-router-dom";

const LINKS = [
    { to: '/', label: '홈' },
    { to: '/movies/popular', label: '인기 영화' },
    { to: 'movies/now_playing', label: '상영 중' },
    { to: '/movies/top_rated', label: '평점 높은' },
    { to: '/movies/upcoming', label: '개봉 예정' },
];

export const Navbar = () => {
    return (
        <nav className="bg-black text-blue-300 p-5 pt-6">
            <span className="text-2xl font-bold mr-8">Movie App</span>
            <span>
            {LINKS.map((link) => (
                <NavLink 
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) => 
                        `mx-2 ${isActive ? 'text-blue-300 font-bold' : 'text-gray-300'}`
                    }
                >
                    {link.label}
                </NavLink>
            ))}
            </span>
        </nav>
    );
}