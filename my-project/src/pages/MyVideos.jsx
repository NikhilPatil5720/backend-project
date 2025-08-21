// src/pages/MyVideos.jsx
import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance"; // ✅ use the axiosInstance with cookies
import { Link } from "react-router-dom";

export default function MyVideos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyVideos = async () => {
      try {
        // ✅ calls backend /api/v1/videos/my
        const res = await axiosInstance.get("/videos/my");
        setVideos(res.data?.data || []);
      } catch (err) {
        console.error("Error fetching my videos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyVideos();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading your videos...</p>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">My Videos</h1>
      {videos.length === 0 ? (
        <p className="text-gray-600">You haven’t uploaded any videos yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {videos.map((video) => (
            <Link
              key={video._id}
              to={`/videos/${video._id}`}
              className="block border rounded-lg shadow hover:shadow-lg transition"
            >
              <img
                src={video.thumbnail || "https://via.placeholder.com/300x200"}
                alt={video.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="p-3">
                <h2 className="font-semibold truncate">{video.title}</h2>
                <p className="text-sm text-gray-500">
                  By {video.owner?.username || "Unknown"}
                </p>
                <p className="text-sm text-gray-400">{video.views} views</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
