// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axiosInstance from "../utils/axiosInstance";

// const PlaylistDetails = () => {
//   const { playlistId } = useParams();
//   const [playlist, setPlaylist] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchPlaylist = async () => {
//       try {
//         if (!playlistId) return; // prevent undefined calls

//         const res = await axiosInstance.get(`/playlists/${playlistId}`);
//         setPlaylist(res.data.data);
//       } catch (err) {
//         console.error("Error fetching playlist details:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPlaylist();
//   }, [playlistId]);

//   if (loading) return <p>Loading...</p>;
//   if (!playlist) return <p>Playlist not found.</p>;

//   return (
//     <div className="p-4">
//       <h2 className="text-xl font-bold mb-4">{playlist.name}</h2>
//       {playlist.videos && playlist.videos.length > 0 ? (
//         <ul className="space-y-3">
//           {playlist.videos.map((video) => (
//             <li key={video._id} className="border p-3 rounded-md">
//               <h4 className="font-semibold">{video.title}</h4>
//               <video
//                 src={video.videoFile}
//                 controls
//                 className="w-full rounded-lg mt-2"
//               />
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p>No videos in this playlist yet.</p>
//       )}
//     </div>
//   );
// };

// export default PlaylistDetails;














// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axiosInstance from "../utils/axiosInstance";

// const PlaylistDetails = () => {
//   const { playlistId } = useParams();
//   const [playlist, setPlaylist] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchPlaylist = async () => {
//       try {
//         if (!playlistId) return;

//         const res = await axiosInstance.get(`/playlists/${playlistId}`);
//         setPlaylist(res.data.data);
//       } catch (err) {
//         console.error("Error fetching playlist details:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPlaylist();
//   }, [playlistId]);

//   if (loading) return <p>Loading...</p>;
//   if (!playlist) return <p>Playlist not found.</p>;

//   // Helper: extract YouTube video ID
//   const extractYouTubeId = (url) => {
//     if (!url) return null;
//     const match = url.match(
//       /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^&?/]+)/
//     );
//     return match ? match[1] : null;
//   };

//   return (
//     <div className="p-4">
//       <h2 className="text-xl font-bold mb-4">{playlist.name}</h2>

//       {playlist.videos && playlist.videos.length > 0 ? (
//         <ul className="space-y-4">
//           {playlist.videos.map((video) => {
//             const youtubeId = extractYouTubeId(video.videoFile);
//             return (
//               <li key={video._id} className="border p-3 rounded-md">
//                 <h4 className="font-semibold">{video.title}</h4>

//                 {youtubeId ? (
//                   // 🎥 If YouTube link → embed iframe
//                   <iframe
//                     width="100%"
//                     height="400"
//                     src={`https://www.youtube.com/embed/${youtubeId}`}
//                     frameBorder="0"
//                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                     allowFullScreen
//                     className="rounded-lg mt-2"
//                   />
//                 ) : (
//                   // 🎥 If local upload → use <video>
//                   <video
//                 src={video.videoUrl || video.videofile} // 👈 match your working CommentSection
//                     controls
//                     className="w-full rounded-lg mt-2"
//                   />
//                 )}
//               </li>
//             );
//           })}
//         </ul>
//       ) : (
//         <p>No videos in this playlist yet.</p>
//       )}
//     </div>
//   );
// };

// export default PlaylistDetails;









import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const PlaylistDetails = () => {
  const { playlistId } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        if (!playlistId) return;

        const res = await axiosInstance.get(`/playlists/${playlistId}`);
        setPlaylist(res.data.data);
      } catch (err) {
        console.error("Error fetching playlist details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylist();
  }, [playlistId]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 dark:text-gray-300 text-lg">Loading playlist...</p>
      </div>
    );

  if (!playlist)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 dark:text-red-400 text-lg">Playlist not found.</p>
      </div>
    );

  const extractYouTubeId = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^&?/]+)/);
    return match ? match[1] : null;
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">{playlist.name}</h2>

      {playlist.videos && playlist.videos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {playlist.videos.map((video) => {
            const youtubeId = extractYouTubeId(video.videoFile);
            return (
              <div
                key={video._id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-1 p-4 flex flex-col"
              >
                <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-100 mb-3">{video.title}</h4>

                {youtubeId ? (
                  <iframe
                    width="100%"
                    height="250"
                    src={`https://www.youtube.com/embed/${youtubeId}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="rounded-xl"
                  />
                ) : (
                  <video
                    src={video.videoUrl || video.videofile}
                    controls
                    className="w-full rounded-xl"
                  />
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 text-lg">No videos in this playlist yet.</p>
      )}
    </div>
  );
};

export default PlaylistDetails;
