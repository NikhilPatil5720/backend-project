
import { Router } from 'express';
import {
    getChannelStats,
    getChannelVideos,
} from "../controllers/dashboard.controller.js"
import { verifyJWT } from "../middleware/auth.middleware.js"

const router = Router();

// Protect all dashboard routes
router.use(verifyJWT);

//  Route for channel stats
router.route("/stats/").get(getChannelStats);

//  Route for channel videos
router.route("/videos").get(getChannelVideos);

export default router
