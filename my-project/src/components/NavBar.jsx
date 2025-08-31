
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineMenu, HiOutlineX, HiOutlineLogout, HiSun, HiMoon, HiSearch } from "react-icons/hi";

export default function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const links = [
    { name: "Home", path: "/" },
    { name: "Explore", path: "/explore" },
    { name: "Upload", path: "/upload" },
    { name: "My Videos", path: "/my-videos" },
    { name: "Subscriptions", path: "/my-subscriptions" },
    { name: "Playlists", path: "/my-playlist" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Feed", path: "/feed" },
    { name: "Health", path: "/healthcheck" },
  ];

  return (
    <nav className="bg-gray-900 dark:bg-gray-800 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl  px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        {/* Brand */}
        <Link to="/" className="text-2xl font-bold text-blue-400 hover:text-blue-500 transition">
          Playvix
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 mx-14">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-10 py-2 rounded-l-full focus:outline-none text-black"
          />
          <button
            type="submit"
            className="bg-blue-500 px-4 py-2 rounded-r-full hover:bg-blue-600 transition flex items-center justify-center"
          >
            <HiSearch className="w-5 h-5" />
          </button>
        </form>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-4">
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="px-3 py-1 rounded-full hover:bg-gray-700 dark:hover:bg-gray-600 transition font-medium"
            >
              {link.name}
            </Link>
          ))}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-gray-700 dark:hover:bg-gray-600 transition"
          >
            {darkMode ? <HiSun className="w-5 h-5" /> : <HiMoon className="w-5 h-5" />}
          </button>
          <button
            onClick={handleLogout}
            className="ml-2 bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-full transition flex items-center gap-1"
          >
            <HiOutlineLogout className="w-5 h-5" /> Logout
          </button>
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center">
          <button onClick={toggleMenu}>
            {menuOpen ? <HiOutlineX className="w-6 h-6" /> : <HiOutlineMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-gray-800 dark:bg-gray-700 px-4 py-4 space-y-2 animate-slide-down">
          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="flex mb-2">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 rounded-l-full focus:outline-none text-black"
            />
            <button
              type="submit"
              className="bg-blue-500 px-4 py-2 rounded-r-full hover:bg-blue-600 transition flex items-center justify-center"
            >
              <HiSearch className="w-5 h-5" />
            </button>
          </form>

          {links.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="block px-3 py-2 rounded-full hover:bg-gray-700 dark:hover:bg-gray-600 transition font-medium"
              onClick={() => setMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}

          <div className="flex items-center justify-between mt-2">
            <button
              onClick={toggleDarkMode}
              className="w-1/2 p-2 rounded-full hover:bg-gray-700 dark:hover:bg-gray-600 transition flex justify-center items-center gap-2"
            >
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
            <button
              onClick={handleLogout}
              className="w-1/2 ml-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full transition flex justify-center items-center gap-2"
            >
              <HiOutlineLogout className="w-5 h-5" /> Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
