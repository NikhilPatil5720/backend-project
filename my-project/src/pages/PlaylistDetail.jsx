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

  if (loading) return <p>Loading...</p>;
  if (!playlist) return <p>Playlist not found.</p>;

  // Helper: extract YouTube video ID
  const extractYouTubeId = (url) => {
    if (!url) return null;
    const match = url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^&?/]+)/
    );
    return match ? match[1] : null;
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">{playlist.name}</h2>

      {playlist.videos && playlist.videos.length > 0 ? (
        <ul className="space-y-4">
          {playlist.videos.map((video) => {
            const youtubeId = extractYouTubeId(video.videoFile);
            return (
              <li key={video._id} className="border p-3 rounded-md">
                <h4 className="font-semibold">{video.title}</h4>

                {youtubeId ? (
                  // 🎥 If YouTube link → embed iframe
                  <iframe
                    width="100%"
                    height="400"
                    src={`https://www.youtube.com/embed/${youtubeId}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="rounded-lg mt-2"
                  />
                ) : (
                  // 🎥 If local upload → use <video>
                  <video
                src={video.videoUrl || video.videofile} // 👈 match your working CommentSection
                    controls
                    className="w-full rounded-lg mt-2"
                  />
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <p>No videos in this playlist yet.</p>
      )}
    </div>
  );
};

export default PlaylistDetails;
