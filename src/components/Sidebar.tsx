import { motion } from "motion/react";
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
import { Link } from "react-router-dom"; // Updated from "react-router" to "react-router-dom"

export function Sidebar() {
  const mainNav = [
    { name: "Trending", icon: FireIcon, path: "/trending" },
    { name: "Popular", icon: ChartBarIcon, path: "/popular" },
    { name: "Movies", icon: FilmIcon, path: "/discover/movie" },
    { name: "TV Shows", icon: TvIcon, path: "/discover/tv" },
    { name: "People", icon: UsersIcon, path: "/people" },
  ];

  const bottomNav = [
    { name: "News Feed", icon: NewspaperIcon, path: "/news" },
    { name: "About", icon: InformationCircleIcon, path: "/about" },
    { name: "Contact", icon: PhoneIcon, path: "/contact" },
  ];

  return (
    <motion.aside
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="sidebar-container w-64 min-h-screen bg-[#0A1625] text-white p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="mb-8 sidebar-logo"
      >
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/WatchWiseLogo.svg"
            alt="WatchWise"
            className="w-auto h-30"
          />
        </Link>
      </motion.div>

      <motion.nav className="space-y-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="nav-group"
        >
          <h2 className="mb-4 text-sm font-semibold text-gray-400">DISCOVER</h2>
          <ul className="space-y-2">
            {mainNav.map((item, index) => (
              <motion.li
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
              >
                <Link
                  to={item.path}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#1A2737] transition-colors"
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="nav-group"
        >
          <h2 className="mb-4 text-sm font-semibold text-gray-400">
            Website Information
          </h2>
          <ul className="space-y-2">
            {bottomNav.map((item, index) => (
              <motion.li
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.3 + index * 0.1, duration: 0.5 }}
              >
                <Link
                  to={item.path}
                  className="flex items-center gap-3 px-3 py-2 transition-colors rounded-lg hover:bg-gray-800"
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </motion.nav>
    </motion.aside>
  );
}
