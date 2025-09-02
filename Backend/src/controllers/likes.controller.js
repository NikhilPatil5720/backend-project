import mongoose, { isValidObjectId } from "mongoose"
import { Like } from "../model/likes.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asynchandler.js"


const toggleVideoLike = asyncHandler(async (req, res) => {
    const userId = req.user._id; // from JWT middleware

    const { videoId } = req.params
    //TODO: toggle like on video

    if (!videoId) {
        throw new ApiError(400, "Video Id required")
    }

    const filter = {
        video: videoId,
        likedBy: userId

    }

    const existingLike = await Like.findOne(filter)

    if (existingLike) {
        await Like.deleteOne(filter)
        return res.status(200).json(new ApiResponse(200, null, "Video unliked"));

    }
    else {
        await Like.create(filter)
        return res.status(200).json(new ApiResponse(200, null, "Video liked"));

    }

})



const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params
    //TODO: toggle like on comment
    if (!commentId) {
        throw new ApiError(400, "comment id req")
    }
    const filter = {
        comment: commentId,
        likedBy: req.user._id
    }

    try {
        const existingComment = await Like.findOne(filter)

        if (existingComment) {
            await Like.deleteOne(filter)
            return res.status(200).json(new ApiResponse(200, null, "comment like removed"))
        }
        else {
            await Like.create(filter)
            return res.status(200).json(new ApiResponse(200, null, "comment liked"))

        }
    }

    catch (error) {
        throw new ApiError(400, "Invalid Comment ID");

    }
})



const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params
    //TODO: toggle like on tweet

    if (!tweetId) {
        throw new ApiError(400, "tweet id required")
    }

    const filter = {
        tweet: tweetId,
        likedBy: req.user._id
    }

    try {
        const existingTweet = await Like.findOne(filter)

        if (existingTweet) {
            await Like.deleteOne(filter)
            return res.status(200).json(new ApiResponse(200, null, "Tweet like"))
        }
        else {
            await Like.create(filter)
            return res.status(200).json(new ApiResponse(200, null, "Tweet unlike"))
        }
    } catch (error) {
        throw new ApiError(400, "Invalid Tweet ID");

    }
})



const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos

    const userId = req.user._id;

    const likedVideos = await Like.aggregate([
        {
            $match: {
                likedBy: userId,
                video: { $exists: true }
            }
        },
        {
            $lookup: {
                from: "videos",               // collection name of videos
                localField: "video",          // field in Like model
                foreignField: "_id",          // field in Video model
                as: "videoData"
            }
        },

        {
            $project: {
                _id: 0,                // hide Like _id
                likedAt: 1,
                "videoData._id": 1,
                "videoData.title": 1,
                "videoData.url": 1,
                "videoData.thumbnail": 1
            }
        }
    ]);

    if (!likedVideos.length) {
        throw new ApiError(404, "No liked videos found");
    }

    return res.status(200).json(
        new ApiResponse(200, likedVideos, "All liked videos fetched successfully")
    );
});







//this code is totally working without the aggregation pipelines

// const {userId}=req.body

// if(!userId){
//     throw new ApiError(400,"user id required")
// }

// const filter={
//     likedBy:req.user._id,
//     video:{$exists:true, $ne:null}   // filter for getting all video only not all coment ant tweet
// }

// const likedVideos = await Like.find(filter).populate("video"); 

//  if (!likedVideos || likedVideos.length === 0) {
//     throw new ApiError(404, "No liked videos found");
// }

// return res.status(200).json(
//     new ApiResponse(200, likedVideos, "All liked videos fetched successfully")
// );



const getVideoLikesCount = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const count = await Like.countDocuments({ video: videoId });
    return res.status(200).json(new ApiResponse(200, { count }, "Video likes count fetched"));
});

const getCommentLikesCount = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const count = await Like.countDocuments({ comment: commentId });
    return res.status(200).json(new ApiResponse(200, { count }, "Comment likes count fetched"));
});

const isVideoLikedByUser = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const liked = await Like.exists({ video: videoId, likedBy: req.user._id });
    return res.status(200).json(new ApiResponse(200, { liked: !!liked }, "Video liked status fetched"));
});

const isCommentLikedByUser = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const liked = await Like.exists({ comment: commentId, likedBy: req.user._id });
    return res.status(200).json(new ApiResponse(200, { liked: !!liked }, "Comment liked status fetched"));
});


export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos,
    getVideoLikesCount,
    getCommentLikesCount,
    isVideoLikedByUser,
    isCommentLikedByUser

}



