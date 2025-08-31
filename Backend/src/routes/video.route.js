
import { Router } from "express";
import {
  deleteVideo,
  getAllVideos,
  getVideoById,
  publishAVideo,
  togglePublishStatus,
  updateVideo,
  incrementViews,
  getMyVideos,
} from "../controllers/video.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

// -------------------- Public routes (no auth required) --------------------
router.get("/", getAllVideos); // Anyone can view videos

// -------------------- Protected routes (auth required) --------------------

//  Put "my videos" route BEFORE :videoId to avoid conflict
router.get("/my", verifyJWT, getMyVideos);

router.post(
  "/",
  verifyJWT, // Only logged-in users can upload
  upload.fields([
    { name: "videoFile", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  publishAVideo
);

// Views increment
router.patch("/views/:videoId", incrementViews);

// Toggle publish status
router.patch("/toggle/publish/:videoId", verifyJWT, togglePublishStatus);

// -------------------- Dynamic videoId routes (must come LAST) --------------------
router
  .route("/:videoId")
  .get(getVideoById) // Anyone can view a single video
  .delete(verifyJWT, deleteVideo) // Only owner can delete 
  .patch(verifyJWT, upload.single("thumbnail"), updateVideo); // Only owner can update

export default router;
