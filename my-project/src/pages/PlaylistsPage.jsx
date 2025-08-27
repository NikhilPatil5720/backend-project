// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axiosInstance from "../utils/axiosInstance";

// const PlaylistPage = () => {
//   const { userId } = useParams(); // assuming route is like /playlists/:userId
//   const [playlists, setPlaylists] = useState([]);

//   useEffect(() => {
//     const fetchPlaylists = async () => {
//       try {
//         const res = await axiosInstance.get(`/playlists/user/${userId}/videos`);
//         setPlaylists(res.data.data); // data is inside ApiResponse
//       } catch (err) {
//         console.error("Error fetching playlists:", err);
//       }
//     };

//     fetchPlaylists();
//   }, [userId]);

//   return (
//     <div className="p-6">
//       <h1 className="text-xl font-bold mb-4">My Playlists</h1>
      
//       {playlists.length === 0 ? (
//         <p>No playlists yet.</p>
//       ) : (
//         playlists.map((playlist) => (
//           <div key={playlist._id} className="mb-6 border p-4 rounded-lg shadow">
//             <h2 className="text-lg font-semibold">{playlist.name}</h2>
//             <p className="text-sm text-gray-500">{playlist.description}</p>
            
//             {playlist.videos.length === 0 ? (
//               <p className="mt-2 text-gray-400">No videos in this playlist</p>
//             ) : (
//               <ul className="mt-2 space-y-2">
//                 {playlist.videos.map((video) => (
//                   <li key={video._id} className="p-2 border rounded">
//                     <p className="font-medium">{video.title}</p>
//                     <a href={video.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
//                       Watch Video
//                     </a>
//                     <p className="text-sm text-gray-400">Views: {video.views}</p>
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default PlaylistPage;




// // working till playlist fetch
// import { useEffect, useState } from "react";
// import { Link, useParams } from "react-router-dom";
// import axiosInstance from "../utils/axiosInstance";

// const PlaylistPage = () => {
//   const { userId } = useParams(); // /playlists/:userId
//   const [playlists, setPlaylists] = useState([]);

//   useEffect(() => {
//     const fetchPlaylists = async () => {
//       try {
//         const res = await axiosInstance.get(`/playlists/user/${userId}`);
//         setPlaylists(res.data.data); // only playlists (no videos here)
//       } catch (err) {
//         console.error("Error fetching playlists:", err);
//       }
//     };

//     fetchPlaylists();
//   }, [userId]);

//   return (
//     <div className="p-6">
//       <h1 className="text-xl font-bold mb-4">My Playlists</h1>

//       {playlists.length === 0 ? (
//         <p>No playlists yet.</p>
//       ) : (
//         playlists.map((playlist) => (
//           <div key={playlist._id} className="mb-6 border p-4 rounded-lg shadow">
//             <h2 className="text-lg font-semibold">{playlist.name}</h2>
//             <p className="text-sm text-gray-500">{playlist.description}</p>

//             {/* ✅ Navigate to playlist details */}
//             <Link
//               to={`/playlist/${playlist._id}`}
//               className="text-blue-500 underline mt-2 inline-block"
//             >
//               View Videos →
//             </Link>
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default PlaylistPage;







// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axiosInstance from "../utils/axiosInstance";

// const MyPlaylistsPage = () => {
//   const [playlists, setPlaylists] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();
//   const userId = localStorage.getItem("userId"); // ✅ make sure you store this after login

//   useEffect(() => {
//     const fetchPlaylists = async () => {
//       try {
//         const res = await axiosInstance.get(`/playlists/user/${userId}`);
//         setPlaylists(res.data.data);
//       } catch (err) {
//         console.error("Error fetching playlists", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchPlaylists();
//   }, [userId]);

//   // ✅ Delete playlist
//   const handleDelete = async (playlistId) => {
//     if (!window.confirm("Are you sure you want to delete this playlist and its videos?")) return;

//     try {
//       await axiosInstance.delete(`/playlists/${playlistId}`);
//       setPlaylists(playlists.filter((pl) => pl._id !== playlistId));
//       alert("Playlist deleted successfully!");
//     } catch (err) {
//       console.error("Error deleting playlist", err);
//       alert("Failed to delete playlist");
//     }
//   };

//   // ✅ Update playlist
//   const handleUpdate = async (playlistId, oldName, oldDesc) => {
//     const newName = prompt("Enter new playlist name:", oldName);
//     const newDesc = prompt("Enter new description:", oldDesc);

//     if (!newName && !newDesc) return;

//     try {
//       const res = await axiosInstance.put(`/playlists/${playlistId}`, {
//         name: newName || oldName,
//         description: newDesc || oldDesc,
//       });

//       setPlaylists(
//         playlists.map((pl) => (pl._id === playlistId ? res.data.data : pl))
//       );
//       alert("Playlist updated successfully!");
//     } catch (err) {
//       console.error("Error updating playlist", err);
//       alert("Failed to update playlist");
//     }
//   };

//   if (loading) return <p>Loading playlists...</p>;

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">My Playlists</h1>
//       {playlists.length === 0 ? (
//         <p>No playlists yet.</p>
//       ) : (
//         <div className="space-y-4">
//           {playlists.map((playlist) => (
//             <div key={playlist._id} className="border p-4 rounded-lg shadow-md">
//               <h2
//                 className="text-xl font-semibold cursor-pointer text-blue-600"
//                 onClick={() => navigate(`/playlists/${playlist._id}`)}
//               >
//                 {playlist.name}
//               </h2>
//               <p>{playlist.description}</p>

//               <div className="flex gap-4 mt-3">
//                 <button
//                   onClick={() =>
//                     handleUpdate(playlist._id, playlist.name, playlist.description)
//                   }
//                   className="px-3 py-1 bg-yellow-500 text-white rounded"
//                 >
//                   Update
//                 </button>
//                 <button
//                   onClick={() => handleDelete(playlist._id)}
//                   className="px-3 py-1 bg-red-500 text-white rounded"
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default MyPlaylistsPage;







import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const MyPlaylistsPage = () => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId"); // ✅ make sure you store this after login

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const res = await axiosInstance.get(`/playlists/user/${userId}`);
        setPlaylists(res.data.data);
      } catch (err) {
        console.error("Error fetching playlists", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlaylists();
  }, [userId]);

  // ✅ Delete playlist
  const handleDelete = async (playlistId) => {
    if (!window.confirm("Are you sure you want to delete this playlist and its videos?")) return;

    try {
      await axiosInstance.delete(`/playlists/${playlistId}`);
      setPlaylists(playlists.filter((pl) => pl._id !== playlistId));
      alert("Playlist deleted successfully!");
    } catch (err) {
      console.error("Error deleting playlist", err);
      alert("Failed to delete playlist");
    }
  };

  // ✅ Update playlist
  const handleUpdate = async (playlistId, oldName, oldDesc) => {
    const newName = prompt("Enter new playlist name:", oldName);
    const newDesc = prompt("Enter new description:", oldDesc);

    if (!newName && !newDesc) return;

    try {
      const res = await axiosInstance.put(`/playlists/${playlistId}`, {
        name: newName || oldName,
        description: newDesc || oldDesc,
      });

      setPlaylists(
        playlists.map((pl) => (pl._id === playlistId ? res.data.data : pl))
      );
      alert("Playlist updated successfully!");
    } catch (err) {
      console.error("Error updating playlist", err);
      alert("Failed to update playlist");
    }
  };

  if (loading) return <p>Loading playlists...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Playlists</h1>
      {playlists.length === 0 ? (
        <p>No playlists yet.</p>
      ) : (
        <div className="space-y-4">
          {playlists.map((playlist) => (
            <div key={playlist._id} className="border p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-blue-600">
                {playlist.name}
              </h2>
              <p>{playlist.description}</p>

              <div className="flex gap-4 mt-3">
                {/* ✅ Navigate to PlaylistDetail page */}
                <button
                  onClick={() => navigate(`/playlist/${playlist._id}`)}
                  className="px-3 py-1 bg-blue-500 text-white rounded"
                >
                  Playlist Videos
                </button>

                <button
                  onClick={() =>
                    handleUpdate(playlist._id, playlist.name, playlist.description)
                  }
                  className="px-3 py-1 bg-yellow-500 text-white rounded"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(playlist._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPlaylistsPage;
