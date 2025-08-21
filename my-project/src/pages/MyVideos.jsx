import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";

const MyVideos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMyVideos = async () => {
    try {
      // 🔹 Match the actual backend route
      const res = await axiosInstance.get("/videos/my-videos", {
        withCredentials: true, // important if using cookies
      });

      // 🔹 Ensure data shape is consistent
      setVideos(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (err) {
      console.error("❌ Error fetching my videos:", err);
      setError(err.response?.data?.message || err.message);
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyVideos();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>My Videos</h2>
      {videos.length === 0 ? (
        <p>No videos uploaded yet.</p>
      ) : (
        videos.map((video) => (
          <div key={video._id}>
            <video src={video.videofile} controls width="300" />
            <h3>{video.title}</h3>
          </div>
        ))
      )}
    </div>
  );
};

export default MyVideos;
