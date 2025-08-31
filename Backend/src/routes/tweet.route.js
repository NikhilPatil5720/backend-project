
import { Router } from "express";
import { createTweet, deleteTweet, getAllTweets, getUserTweets, updateTweet } from "../controllers/tweet.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

// Apply verifyJWT middleware to all tweet routes
router.use(verifyJWT);

// Create tweet
router.route("/").post(createTweet);

// Update & Delete tweet by ID
router.route("/:tweetId").patch(updateTweet).delete(deleteTweet);

// Get tweets of logged-in user
router.route("/me").get(getUserTweets);

// (Optional) Get tweets of any user by ID
router.route("/user/:userId").get(getUserTweets);

router.route("/").get(getAllTweets); // Fetch all tweets (if needed)

export default router;
