import mongoose from "mongoose"
import {Video} from "../model/video.model.js"
import {Subscription} from "../model/subscription.model.js"
// import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.

            const {channelId}=req.params

            if(!channelId){
                throw new ApiError(400,"channel Id required")
            }

            const objectChannelId = new mongoose.Types.ObjectId(channelId); // 🔹 change 2: convert to ObjectId

            const stats=await Video.aggregate([
                {
                    $match:{
                    owner:objectChannelId
                }
            },{

                    $lookup:{
                            from:"likes",
                            localField:"_id",
                            foreignField:"video",
                            as:"likes"
                    }
            },{

                $group:{
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





const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel


        // const {channelId}=req.params              this is wrong you should take from query
        const channelId = req.query.channelId || req.user._id; // 🔹 fix 1

        
        if(!channelId){
            throw new ApiError(400,"channel Id required")
        }


          if (!mongoose.Types.ObjectId.isValid(channelId)) {
        throw new ApiError(400, "Invalid channel Id");
    }
            // Convert to ObjectId
    const objectChannelId = new mongoose.Types.ObjectId(channelId); // 🔹 fix 2


        const filter={
            owner:objectChannelId,
         video:{$exists:true, $ne:null}
            
        }

        const video=await Video.find(filter)

        if(!video || video.length === 0){
            throw new ApiError(400,"no video found")
        }

        return res.status(200).json(new ApiResponse(200,video,"all video fetched succesfully"))
})



export {
    getChannelStats, 
    getChannelVideos
    }