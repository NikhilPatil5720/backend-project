// import { useEffect, useState } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";
// import { useNavigate } from "react-router-dom";

// export default function Home() {
//   const [videos, setVideos] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchVideos = async () => {
//       try {
//         const res = await axios.get("http://localhost:3000/api/v1/videos");
//         setVideos(res.data?.data || []);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchVideos();
//   }, []);

//   if (loading) return <p className="text-center mt-10">Loading videos...</p>;

  
//   const goToDashboard = () => {
//     navigate("/dashboard"); // Navigates to dashboard page
//   };
//   return (

//     <div className="max-w-6xl mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-6">Home</h1>

//       <button
//         onClick={goToDashboard}
//         className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
//       >
//         Go to Dashboard
//       </button>
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//         {videos.map((video) => (
//           <Link
//             key={video._id}
//             to={`/videos/${video._id}`}
//             className="block border rounded-lg shadow hover:shadow-lg transition"
//           >
//             <img
//               src={video.thumbnail || "https://via.placeholder.com/300x200"}
//               alt={video.title}
//               className="w-full h-48 object-cover rounded-t-lg"
//             />
//             <div className="p-3">
//               <h2 className="font-semibold truncate">{video.title}</h2>
//               <p className="text-sm text-gray-500">
//                 By {video.owner?.username || "Unknown"}
//               </p>
//               <p className="text-sm text-gray-400">{video.views} views</p>
//             </div>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/v1/videos");
        setVideos(res.data?.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const goToDashboard = () => {
    navigate("/dashboard"); // Navigates to dashboard page
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Home</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden rounded-2xl h-80">
              <Skeleton className="h-full w-full" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold tracking-tight">Made By @Nikhil</h1>
    
      </div>

      {/* Videos Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        {videos.map((video) => (
          <Link key={video._id} to={`/videos/${video._id}`}>
            <Card className="overflow-hidden rounded-2xl shadow-md hover:shadow-lg transition-transform hover:scale-[1.02] relative h-96">
              <img
                src={video.thumbnail || "https://via.placeholder.com/300x200"}
                alt={video.title}
                className="w-full h-full object-cover"
              />
              {/* Overlay info */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
                <h2 className="font-semibold text-lg truncate">{video.title}</h2>
                <p className="text-sm">{video.owner?.username || "Unknown"}</p>
                <p className="text-sm">{video.views} views</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

