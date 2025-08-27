// src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-3 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">MyTube</Link>
      <div className="space-x-4">
        <Link to="/" className="hover:underline">Home</Link>
        <Link to="/upload" className="hover:underline">Upload</Link>
                <Link to="/explore">Explore</Link>
        <Link to="/my-subscriptions" className="hover:underline">My Subscriptions</Link>
        <Link to="/my-videos" className="hover:underline">My Videos</Link>
                <Link to="/feed">Tweets</Link>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/healthcheck">Health Check</Link>
         <Link to="/my-playlist" className="hover:text-blue-400">
          My Playlists
        </Link>

                

        <button
          onClick={handleLogout}
          className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}




