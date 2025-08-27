import { Router } from "express";
import {
    addVideoToPlaylist,
    createPlaylist,
    deletePlaylist,
    getPlaylistById,
    getUserPlaylists,
    removeVideoFromPlaylist,
    updatePlaylist,
    getUserPlaylistsWithVideos
} from "../controllers/playlist.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

// ✅ Apply JWT middleware to all playlist routes
router.use(verifyJWT);

// ================= PLAYLIST ROUTES ================= //

// Create a new playlist
// POST /api/v1/playlists
router.route("/").post(createPlaylist);

// Get all playlists of a user
// GET /api/v1/playlists/user/:userId
router.route("/user/:userId").get(getUserPlaylists);


// Add video to playlist
// PATCH /api/v1/playlists/add/:videoId/:playlistId
router.route("/add/:videoId/:playlistId").patch(addVideoToPlaylist);

// Remove video from playlist
// DELETE /api/v1/playlists/remove/:videoId/:playlistId
router.route("/remove/:videoId/:playlistId").delete(removeVideoFromPlaylist);

// Get, update, delete a playlist by ID
// GET /api/v1/playlists/:playlistId
// PATCH /api/v1/playlists/:playlistId
// DELETE /api/v1/playlists/:playlistId
router
    .route("/:playlistId")
    .get(getPlaylistById)
    .put(updatePlaylist)
    .delete(deletePlaylist);

    

    // ✅ Get all playlists of a user with videos
// GET /api/v1/playlists/user/:userId/videos
router.route("/user/:userId/videos").get(getUserPlaylistsWithVideos);


router.put("/playlists/:playlistId", updatePlaylist);

export default router;










// import { Router } from "express";
// import {
//   addVideoToPlaylist,
//   createPlaylist,
//   deletePlaylist,
//   getPlaylistById,
//   getUserPlaylists,
//   removeVideoFromPlaylist,
//   updatePlaylist,
//   getUserPlaylistsWithVideos
// } from "../controllers/playlist.controller.js";
// import { verifyJWT } from "../middleware/auth.middleware.js";

// const router = Router();

// // ✅ Apply JWT middleware to all playlist routes
// router.use(verifyJWT);

// // ================= PLAYLIST ROUTES ================= //

// // Create a new playlist
// // POST /api/v1/playlists
// router.route("/").post(createPlaylist);

// // Get all playlists of a user
// // GET /api/v1/playlists/user/:userId
// router.route("/user/:userId").get(getUserPlaylists);

// // ✅ Get all playlists of a user with videos
// // GET /api/v1/playlists/user/:userId/videos
// router.route("/user/:userId/videos").get(getUserPlaylistsWithVideos);

// // Add video to playlist
// // PATCH /api/v1/playlists/add/:playlistId/:videoId
// router.route("/add/:playlistId/:videoId").patch(addVideoToPlaylist);

// // Remove video from playlist
// // DELETE /api/v1/playlists/remove/:playlistId/:videoId
// router.route("/remove/:playlistId/:videoId").delete(removeVideoFromPlaylist);

// // Get, update, delete a playlist by ID
// // GET /api/v1/playlists/:playlistId
// // PUT /api/v1/playlists/:playlistId
// // DELETE /api/v1/playlists/:playlistId
// router
//   .route("/:playlistId")
//   .get(getPlaylistById)
//   .put(updatePlaylist)
//   .delete(deletePlaylist);

// export default router;
