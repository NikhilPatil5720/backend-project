// import axiosInstance from "../utils/axiosInstance";
// import axios from "axios";

// // Create playlist
// export const createPlaylist = async (name, description) => {
//   const res = await axiosInstance.post("/playlists", { name, description });
//   return res.data;
// };

// // Get all playlists for a user
// export const getUserPlaylists = async (userId) => {
//   const res = await axiosInstance.get(`/playlists/user/${userId}`);
//   return res.data;
// };

// // Get single playlist
// export const getPlaylistById = async (playlistId) => {
//   const res = await axiosInstance.get(`/playlists/${playlistId}`);
//   return res.data;
// };

// // Add video to playlist
// export const addVideoToPlaylist = async (videoId, playlistId) => {
//   const res = await axiosInstance.patch(`/playlists/add/${videoId}/${playlistId}`);
//   return res.data;
// };

// // Remove video from playlist
// export const removeVideoFromPlaylist = async (videoId, playlistId) => {
//   const res = await axiosInstance.delete(`/playlists/remove/${videoId}/${playlistId}`);
//   return res.data;
// };

// // Delete playlist
// export const deletePlaylist = async (playlistId) => {
//   const res = await axiosInstance.delete(`/playlists/${playlistId}`);
//   return res.data;
// };

// // Alternate fetcher with credentials (if needed)
// export const fetchUserPlaylists = async (userId) => {
//   return axios.get(`http://localhost:3000/api/v1/playlists/user/${userId}`, {
//     withCredentials: true,
//   });
// };











// // src/api/playlistApi.js
// import axiosInstance from "../utils/axiosInstance";

// // ✅ Create new playlist
// export const createPlaylist = async (name) => {
//       if (!name) throw new Error("Playlist name is required");

//   return await axiosInstance.post("/playlists", { name });
// };

// // ✅ Get all playlists
// export const getAllPlaylists = async (userId) => {
// const res = await axiosInstance.get(`/playlists/user/${userId}`);
//   return res.data;
// };

// // ✅ Delete playlist
// export const deletePlaylist = async (playlistId) => {
//   return await axiosInstance.delete(`/playlists/${playlistId}`);
// };

// // ✅ Add video to playlist
// export const addVideoToPlaylist = async (videoId, playlistId) => {
//   if (!videoId || !playlistId) {
//     throw new Error("Both videoId and playlistId are required!");
//   }
//   return await axiosInstance.patch(`/playlists/add/${playlistId}/${videoId}`);
// };

// // ✅ Remove video from playlist (optional helper)
// export const removeVideoFromPlaylist = async (videoId, playlistId) => {
//   if (!videoId || !playlistId) {
//     throw new Error("Both videoId and playlistId are required!");
//   }
//   return await axiosInstance.patch(`/playlists/remove/${playlistId}/${videoId}`);
// };



// // ✅ Get single playlist by ID (fix for your error)
// export const getPlaylistById = (id) =>
//   axiosInstance.get(`/playlists/${id}`);








// src/api/playlistApi.js
import axiosInstance from "../utils/axiosInstance";

// ✅ Create new playlist
export const createPlaylist = async (userId, name) => {
  if (!name) throw new Error("Playlist name is required");
  const res = await axiosInstance.post("/playlists", { name });
  return res; // ✅ return full axios response
};


// ✅ Get all playlists for a user
export const getAllPlaylists = async (userId) => {
  if (!userId) throw new Error("userId is required");
  const res = await axiosInstance.get(`/playlists/user/${userId}`);
  return res.data;
};

// ✅ Add video to playlist
// Add video to playlist
// playlistApi.js
// playlistApi.js
export const addVideoToPlaylist = async (playlistId, videoId) => {
  try {
    const res = await axiosInstance.patch(
      `/playlists/add/${videoId}/${playlistId}`
    );
    return res.data;
  } catch (error) {
    console.error("❌ Error saving to playlist:", error);
    throw error;
  }
};



// ✅ Remove video from playlist
export const removeVideoFromPlaylist = async (videoId, playlistId) => {
  if (!videoId || !playlistId) {
    throw new Error("Both videoId and playlistId are required!");
  }
  return await axiosInstance.delete(`/playlists/remove/${videoId}/${playlistId}`);
};


// ✅ Get playlist by ID
export const getPlaylistById = async (playlistId) => {
  if (!playlistId) throw new Error("playlistId is required");
  const res = await axiosInstance.get(`/playlists/${playlistId}`);
  return res.data;
};

// ✅ Delete playlist
export const deletePlaylist = async (playlistId) => {
  if (!playlistId) throw new Error("playlistId is required");
  const res = await axiosInstance.delete(`/playlists/${playlistId}`);
  return res.data;
};

// ✅ Update playlist 
export const updatePlaylist = async (playlistId, name, description) => {
  if (!playlistId) throw new Error("playlistId is required");
  return await axiosInstance.put(`/playlists/${playlistId}`, { name, description });
};