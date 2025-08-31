import { Playlist } from "../model/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { Video } from "../model/video.model.js";

// Create playlist

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description, videos } = req.body;

  if (!name) {
    throw new ApiError(400, "Playlist name is required");
  }

  const playlist = await Playlist.create({
    name,
    description: description || "",
    owner: req.user._id,
    videos: Array.isArray(videos) && videos.length > 0 ? videos : [] // ✅ safe
  });

  return res
    .status(201)
    .json(new ApiResponse(201, playlist, "Playlist created successfully"));
});



// Get all playlists of a user
const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) throw new ApiError(400, "userId is required");

  const playlists = await Playlist.find({ owner: userId }).populate("videos");

  return res
    .status(200)
    .json(new ApiResponse(200, playlists, "User playlists fetched successfully"));
});


// Get playlist by ID
const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  if (!playlistId) throw new ApiError(400, "playlistId is required");

  const playlist = await Playlist.findById(playlistId).populate("videos");

  if (!playlist) throw new ApiError(404, "Playlist not found");

  return res.status(200).json(new ApiResponse(200, playlist, "Playlist fetched successfully"));
});

// Add video to playlist
// playlist.controller.js
const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { videoId, playlistId } = req.params;

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  // check if video already exists
  if (playlist.videos.includes(videoId)) {
    return res.status(200).json(
      new ApiResponse(200, playlist, "Video already in playlist")
    );
  }

  playlist.videos.push(videoId);
  await playlist.save();

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Video added to playlist"));
});

// Remove video from playlist
const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) throw new ApiError(404, "Playlist not found");

  if (!playlist.videos.includes(videoId)) {
    throw new ApiError(400, "Video not in playlist");
  }

  playlist.videos.pull(videoId);
  await playlist.save();

  return res.status(200).json(new ApiResponse(200, playlist, "Video removed successfully"));
});

// Delete playlist and its videos
const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) throw new ApiError(404, "Playlist not found");

  // ❌ Don't delete Video documents, just delete the playlist
  await Playlist.findByIdAndDelete(playlistId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Playlist deleted successfully (videos remain intact)"));
});


// Update playlist
// Update playlist
const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;

  if (!name && !description) {
    throw new ApiError(400, "Provide at least one field (name or description)");
  }

  const updated = await Playlist.findByIdAndUpdate(
    playlistId,
    { $set: { ...(name && { name }), ...(description && { description }) } },
    { new: true }
  );

  if (!updated) throw new ApiError(404, "Playlist not found");

  return res
    .status(200)
    .json(new ApiResponse(200, updated, "Playlist updated successfully"));
});



// ✅ Get all playlists of a user with videos included
const getUserPlaylistsWithVideos = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) throw new ApiError(400, "userId is required");

  const playlists = await Playlist.find({ owner: userId })
    .populate({
      path: "videos",            // populate video details
      select: "title url views", // only pick needed fields from Video model
    })
    .select("name description videos createdAt updatedAt"); // optional

  if (!playlists || playlists.length === 0) {
    throw new ApiError(404, "No playlists found for this user");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, playlists, "User playlists with videos fetched successfully"));
});


export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,getUserPlaylistsWithVideos
};
