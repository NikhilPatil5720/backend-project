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
import { Card, CardContent } from "@/components/ui/card";

const DashboardPage = ({ channelId }) => {
  const [stats, setStats] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);

        const statsUrl = channelId
          ? `/dashboard/stats/${channelId}`
          : `/dashboard/stats`;
        const videosUrl = channelId
          ? `/dashboard/videos?channelId=${channelId}`
          : `/dashboard/videos`;

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

  if (loading)
    return (
      <p className="text-center mt-10 text-lg font-medium">Loading dashboard...</p>
    );

  if (!stats) return <p className="text-center mt-10 text-lg">No stats available.</p>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 tracking-tight">Dashboard</h1>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-4 bg-blue-100 dark:bg-blue-900 text-center hover:scale-105 transition-transform shadow-lg">
          <CardContent>
            <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">
              {stats.totalVideos}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Videos</p>
          </CardContent>
        </Card>
        <Card className="p-4 bg-green-100 dark:bg-green-900 text-center hover:scale-105 transition-transform shadow-lg">
          <CardContent>
            <p className="text-2xl font-bold text-green-800 dark:text-green-200">
              {stats.totalViews}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Views</p>
          </CardContent>
        </Card>
        <Card className="p-4 bg-red-100 dark:bg-red-900 text-center hover:scale-105 transition-transform shadow-lg">
          <CardContent>
            <p className="text-2xl font-bold text-red-800 dark:text-red-200">
              {stats.totalLikes}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Likes</p>
          </CardContent>
        </Card>
        <Card className="p-4 bg-purple-100 dark:bg-purple-900 text-center hover:scale-105 transition-transform shadow-lg">
          <CardContent>
            <p className="text-2xl font-bold text-purple-800 dark:text-purple-200">
              {stats.totalSubscribers}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Subscribers</p>
          </CardContent>
        </Card>
      </div>

      {/* Videos Section */}
      <h2 className="text-2xl font-bold mb-4">Uploaded Videos</h2>
      {videos.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No videos found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <Card
              key={video._id}
              className="overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-transform hover:scale-[1.02] relative group"
            >
              <img
                src={video.thumbnail || "https://via.placeholder.com/400x250"}
                alt={video.title}
                className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {/* Overlay info */}
              <div className="p-4">
                <h3 className="font-semibold text-lg truncate">{video.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {video.description || "No description"}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Views: {video.views} • Published: {video.isPublish ? "Yes" : "No"}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
