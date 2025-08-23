// import { useEffect, useState } from "react";
// import axiosInstance from "../utils/axiosInstance";
// // import { useAuth } from "../context/AuthContext"; // assuming you have AuthContext for user
// import { useNavigate } from "react-router-dom";

// export default function DashboardPage() {
//   const [stats, setStats] = useState(null);
//   const [videos, setVideos] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!user) {
//       navigate("/login");
//       return;
//     }

//     const fetchDashboard = async () => {
//       try {
//         // 1. Fetch stats
//         const statsRes = await axiosInstance.get(
//           `/dashboard/stats/${user._id}`
//         );

//         // 2. Fetch videos
//         const videoRes = await axiosInstance.get(
//           `/dashboard/videos?channelId=${user._id}`
//         );

//         setStats(statsRes.data.data);
//         setVideos(videoRes.data.data);
//       } catch (err) {
//         console.error("❌ Error fetching dashboard:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDashboard();
//   }, [user, navigate]);

//   if (loading) return <p className="p-4">Loading dashboard...</p>;

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">📊 Dashboard</h1>

//       {/* Stats Section */}
//       {stats && (
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
//           <div className="bg-blue-100 p-4 rounded-lg shadow">
//             <p className="text-lg font-semibold">Videos</p>
//             <p className="text-2xl">{stats.totalVideos}</p>
//           </div>
//           <div className="bg-green-100 p-4 rounded-lg shadow">
//             <p className="text-lg font-semibold">Views</p>
//             <p className="text-2xl">{stats.totalViews}</p>
//           </div>
//           <div className="bg-yellow-100 p-4 rounded-lg shadow">
//             <p className="text-lg font-semibold">Likes</p>
//             <p className="text-2xl">{stats.totalLikes}</p>
//           </div>
//           <div className="bg-purple-100 p-4 rounded-lg shadow">
//             <p className="text-lg font-semibold">Subscribers</p>
//             <p className="text-2xl">{stats.totalSubscribers}</p>
//           </div>
//         </div>
//       )}

//       {/* Videos Section */}
//       <h2 className="text-xl font-semibold mb-3">🎥 Your Videos</h2>
//       {videos.length === 0 ? (
//         <p>No videos uploaded yet.</p>
//       ) : (
//         <div className="grid md:grid-cols-2 gap-4">
//           {videos.map((video) => (
//             <div
//               key={video._id}
//               className="border rounded-lg shadow p-3 bg-white"
//             >
//               <img
//                 src={video.thumbnail}
//                 alt={video.title}
//                 className="w-full h-40 object-cover rounded-lg"
//               />
//               <h3 className="mt-2 font-semibold">{video.title}</h3>
//               <p className="text-gray-600 text-sm">{video.description}</p>
//               <p className="text-sm mt-1">👁️ {video.views} views</p>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }




import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";

const DashboardPage = ({ channelId }) => {
  const [stats, setStats] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
   const fetchDashboard = async () => {
  try {
    setLoading(true);

    // Use query param only if channelId is explicitly provided
    const statsUrl = channelId ? `/dashboard/stats/${channelId}` : `/dashboard/stats`;
    const videosUrl = channelId ? `/dashboard/videos?channelId=${channelId}` : `/dashboard/videos`;

    const statsRes = await axiosInstance.get(statsUrl);
    setStats(statsRes.data.data);

    const videosRes = await axiosInstance.get(videosUrl);
    setVideos(videosRes.data.data);
  } catch (err) {
    console.error("❌ Error fetching dashboard:", err);
  } finally {
    setLoading(false);
  }
};


    fetchDashboard();
  }, [channelId]);

  if (loading) return <p>Loading dashboard...</p>;

  if (!stats) return <p>No stats available.</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-gray-100 rounded text-center">
          <p className="text-lg font-semibold">{stats.totalVideos}</p>
          <p>Videos</p>
        </div>
        <div className="p-4 bg-gray-100 rounded text-center">
          <p className="text-lg font-semibold">{stats.totalViews}</p>
          <p>Views</p>
        </div>
        <div className="p-4 bg-gray-100 rounded text-center">
          <p className="text-lg font-semibold">{stats.totalLikes}</p>
          <p>Likes</p>
        </div>
        <div className="p-4 bg-gray-100 rounded text-center">
          <p className="text-lg font-semibold">{stats.totalSubscribers}</p>
          <p>Subscribers</p>
        </div>
      </div>

      {/* Videos Section */}
      <h2 className="text-xl font-bold mb-4">Uploaded Videos</h2>
      {videos.length === 0 ? (
        <p>No videos found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {videos.map((video) => (
            <div key={video._id} className="border rounded p-2">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-40 object-cover mb-2 rounded"
              />
              <p className="font-semibold">{video.title}</p>
              <p className="text-sm text-gray-500">{video.description}</p>
              <p className="text-sm text-gray-500">
                Views: {video.views} • Published: {video.isPublish ? "Yes" : "No"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
