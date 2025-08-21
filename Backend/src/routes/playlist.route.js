import { Router } from 'express';
import {
    addVideoToPlaylist,
    createPlaylist,
    deletePlaylist,
    getPlaylistById,
    getUserPlaylists,
    removeVideoFromPlaylist,
    updatePlaylist,
} from "../controllers/playlist.controller.js"
import {verifyJWT} from "../middleware/auth.middleware.js"


const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/").post(createPlaylist)






// GET /playlists/:playlistId → Get playlist by ID
// PATCH /playlists/:playlistId → Update playlist
// DELETE /playlists/:playlistId → Delete playlist
router
    .route("/:playlistId")
    .get(getPlaylistById)
    .patch(updatePlaylist)
    .delete(deletePlaylist);


// PATCH /playlists/add/:videoId/:playlistId → Add video to playlist
router.route("/add/:videoId/:playlistId").patch(addVideoToPlaylist);

// PATCH /playlists/remove/:videoId/:playlistId → Remove video from playlist
router.route("/remove/:videoId/:playlistId").patch(removeVideoFromPlaylist);

// GET /playlists/user/:userId → Get all playlists of a user
router.route("/user/:userId").get(getUserPlaylists);

export default router