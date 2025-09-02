import mongoose from "mongoose"
import { Video } from "../model/video.model.js"
import { Subscription } from "../model/subscription.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asynchandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.

    // take channelId from params OR fallback to logged-in user
    const channelId = req.params.channelId || req.user._id;

    if (!channelId) {
        throw new ApiError(400, "channel Id required");
    }

    const objectChannelId = new mongoose.Types.ObjectId(channelId);

    const stats = await Video.aggregate([
        {
            $match: {
                owner: objectChannelId
            }
        }, {

            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "video",
                as: "likes"
            }
        }, {

            $group: {
                _id: null,
                totalVideos: { $sum: 1 },
                totalViews: { $sum: "$views" },
                totalLikes: { $sum: { $size: "$likes" } }
            }
        }


    ])


    // Get total subscribers separately (from Subscription collection)
    const subscriberCount = await Subscription.countDocuments({ channel: objectChannelId });

    if (!stats || stats.length === 0) {
        throw new ApiError(404, "No stats found for this channel");
    }

    const result = {
        totalVideos: stats[0].totalVideos,
        totalViews: stats[0].totalViews,
        totalLikes: stats[0].totalLikes,
        totalSubscribers: subscriberCount
    };

    return res.status(200).json(
        new ApiResponse(200, result, "Channel stats fetched successfully")
    );
})



//get all videos of a channel
const getChannelVideos = asyncHandler(async (req, res) => {
    const channelId = req.query.channelId || req.user._id;

    if (!channelId) {
        throw new ApiError(400, "channelId required");
    }

    if (!mongoose.Types.ObjectId.isValid(channelId)) {
        throw new ApiError(400, "Invalid channelId");
    }

    const objectChannelId = new mongoose.Types.ObjectId(channelId);



    // Fetch videos owned by this channel/user
    const videos = await Video.find({ owner: objectChannelId });

    if (!videos || videos.length === 0) {
        throw new ApiError(404, "No videos found for this channel");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, videos, "All videos fetched successfully"));
});



export {
    getChannelStats,
    getChannelVideos
}