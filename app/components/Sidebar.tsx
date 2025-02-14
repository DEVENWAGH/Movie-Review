import {
    FilmIcon,
    FireIcon,
    TvIcon,
    UsersIcon,
    NewspaperIcon,
    ChartBarIcon,
    InformationCircleIcon,
    PhoneIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router";  // Updated import
import Logo from './Logo';

export function Sidebar() {
    const mainNav = [
        { name: "Trending", icon: FireIcon, path: "/trending" },
        { name: "Popular", icon: ChartBarIcon, path: "/popular" },
        { name: "Movies", icon: FilmIcon, path: "/discover/movie" }, // Updated path
        { name: "TV Shows", icon: TvIcon, path: "/discover/tv" },
        { name: "People", icon: UsersIcon, path: "/people" },
    ];

    const bottomNav = [
        { name: "News Feed", icon: NewspaperIcon, path: "/news" },
        { name: "About", icon: InformationCircleIcon, path: "/about" },
        { name: "Contact", icon: PhoneIcon, path: "/contact" },
    ];

    return (
        <aside className="w-64 min-h-screen bg-[#0A1625] text-white p-4">
            <div className="mb-8">
                <Logo />
            </div>

            <nav className="space-y-8">
                <div>
                    <h2 className="text-gray-400 text-sm font-semibold mb-4">DISCOVER</h2>
                    <ul className="space-y-2">
                        {mainNav.map((item) => (
                            <li key={item.name}>
                                <Link
                                    to={item.path}
                                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#1A2737] transition-colors"
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span>{item.name}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h2 className="text-gray-400 text-sm font-semibold mb-4">Website Information</h2>
                    <ul className="space-y-2">
                        {bottomNav.map((item) => (
                            <li key={item.name}>
                                <Link
                                    to={item.path}
                                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span>{item.name}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>
        </aside>
    );
}
