import axiosInstance from "../utils/axiosInstance";

//  Create new playlist
export const createPlaylist = async (userId, name) => {
  if (!name) throw new Error("Playlist name is required");
  const res = await axiosInstance.post("/playlists", { name });
  return res; //  return full axios response
};



//  Get all playlists for a user
export const getAllPlaylists = async (userId) => {
  if (!userId) throw new Error("userId is required");
  const res = await axiosInstance.get(`/playlists/user/${userId}`);
  return res.data;
};



//  Add video to playlist
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



//  Remove video from playlist
export const removeVideoFromPlaylist = async (videoId, playlistId) => {
  if (!videoId || !playlistId) {
    throw new Error("Both videoId and playlistId are required!");
  }
  return await axiosInstance.delete(`/playlists/remove/${videoId}/${playlistId}`);
};



// Get playlist by ID
export const getPlaylistById = async (playlistId) => {
  if (!playlistId) throw new Error("playlistId is required");
  const res = await axiosInstance.get(`/playlists/${playlistId}`);
  return res.data;
};


// Delete playlist
export const deletePlaylist = async (playlistId) => {
  if (!playlistId) throw new Error("playlistId is required");
  const res = await axiosInstance.delete(`/playlists/${playlistId}`);
  return res.data;
};


//  Update playlist 
export const updatePlaylist = async (playlistId, name, description) => {
  if (!playlistId) throw new Error("playlistId is required");
  return await axiosInstance.put(`/playlists/${playlistId}`, { name, description });
};