// import { Router } from 'express';
// import {
//     getSubscribedChannels,
//     getUserChannelSubscribers,
//     toggleSubscription,
// } from "../controllers/subscription.controller.js"
// import {verifyJWT} from "../middleware/auth.middleware.js"

// const router = Router();
// router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

// router
//     .route("/c/:subscriberId")
//     .get(getSubscribedChannels)
//     .post(toggleSubscription);

// router.route("/u/:channelId").get(getUserChannelSubscribers);

// export default router







// routes define as per the frontend requirements
import { Router } from 'express';
import {
    getSubscribedChannels,
    getUserChannelSubscribers,
    toggleSubscription,
} from "../controllers/subscription.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();
router.use(verifyJWT);

// ✅ Get all subscribers of a channel
router.route("/c/:channelId").get(getUserChannelSubscribers);

// ✅ Toggle subscription for a channel
router.route("/toggle/:channelId").post(toggleSubscription);

// ✅ Get all channels a user is subscribed to
router.route("/u/:subscriberId").get(getSubscribedChannels);




export default router;
