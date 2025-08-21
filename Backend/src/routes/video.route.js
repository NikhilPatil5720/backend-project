import { Router } from "express";
import {
  deleteVideo,
  getAllVideos,
  getVideoById,
  publishAVideo,
  togglePublishStatus,
  updateVideo,
} from "../controllers/video.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import { incrementViews } from "../controllers/video.controller.js";
import { getMyVideos } from "../controllers/video.controller.js";
const router = Router();

// Public routes (no auth required)
router.route("/").get(getAllVideos); // Anyone can view videos
router.route("/:videoId").get(getVideoById); // Anyone can view a single video

// Protected routes (auth required)
router
  .route("/")
  .post(
    verifyJWT, // Only logged-in users can upload
    upload.fields([
      { name: "videoFile", maxCount: 1 },
      { name: "thumbnail", maxCount: 1 },
    ]),
    publishAVideo
  );

router
  .route("/:videoId")
  .delete(verifyJWT, deleteVideo) // Only owner can delete (check in controller)
  .patch(verifyJWT, upload.single("thumbnail"), updateVideo); // Only owner can update
  router.patch("/views/:videoId", incrementViews);

router
  .route("/toggle/publish/:videoId")
  .patch(verifyJWT, togglePublishStatus); // Only owner can toggle publish


  // video.routes.js
router.get("/my", verifyJWT, getMyVideos);

export default router;
