import { Router } from 'express';
import {
    getLikedVideos,
    toggleCommentLike,
    toggleVideoLike,
    toggleTweetLike,
    getVideoLikesCount,

    getCommentLikesCount,
    isVideoLikedByUser,
    isCommentLikedByUser
} from "../controllers/likes.controller.js"
import {verifyJWT} from "../middleware/auth.middleware.js"

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/toggle/v/:videoId").post(toggleVideoLike);
router.route("/toggle/c/:commentId").post(toggleCommentLike);
router.route("/toggle/t/:tweetId").post(toggleTweetLike);
router.route("/videos").get(getLikedVideos);



router.get("/count/v/:videoId", getVideoLikesCount);
router.get("/count/c/:commentId", getCommentLikesCount);
router.get("/status/v/:videoId", verifyJWT, isVideoLikedByUser);
router.get("/status/c/:commentId", verifyJWT, isCommentLikedByUser);

export default router