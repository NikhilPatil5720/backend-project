import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import api from "../utils/axiosInstance";
import { Card, CardContent } from "@/components/ui/card";

export default function SearchResults() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("q");

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      if (!searchQuery) return;
      setLoading(true);
      try {
        const res = await api.get(`/videos`, { params: { query: searchQuery } });
        setVideos(res.data.data);
      } catch (err) {
        console.error("❌ Error fetching search results:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, [searchQuery]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">
        Search Results for "{searchQuery}"
      </h2>

      {loading ? (
        <p>Loading...</p>
      ) : videos.length === 0 ? (
        <p className="text-gray-500">No videos found.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {videos.map((video) => (
            <Card key={video._id} className="shadow-md hover:shadow-lg transition rounded-xl overflow-hidden">
              <Link to={`/videos/${video._id}`}>
                {/* Video Thumbnail */}
                <img
                  src={video.thumbnail || "/placeholder.png"}
                  alt={video.title}
                  className="w-full h-48 object-cover"
                />

                <CardContent className="p-4 flex flex-col">
                  <h3 className="font-semibold text-lg mb-1">{video.title}</h3>
                  <p className="text-sm text-gray-500 mb-1">
                    By {video.owner.username}
                  </p>
                  <p className="text-sm text-gray-400">
                    {video.views || 0} views
                  </p>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
