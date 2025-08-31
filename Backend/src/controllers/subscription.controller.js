import mongoose, {isValidObjectId} from "mongoose"
// import {User} from "../models/user.model.js"
import { Subscription } from "../model/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asynchandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription

        if(!channelId){
            throw new ApiError(400,"channel id required")
        }

        const filter={
            subscriber:req.user._id,
            channel:channelId
        }

        const existingSub=await Subscription.findOne(filter)

        if(existingSub){
            await Subscription.deleteOne(filter)
            return res.status(200).json(new ApiResponse(200,null,"Channel unsuscribed"))
        }
        else{
            await Subscription.create(filter)
             return res.status(200).json(new ApiResponse(200,null,"Channel suscribed"))

        }
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params

    if(!channelId){
        throw new ApiError(400,"channel id required")
    }

    const filter={
        channel:channelId
    }
    const subscriber = await Subscription.find(filter).populate("subscriber"); 
    
     if (!subscriber || subscriber.length === 0) {
        throw new ApiError(404, "No subscriber  found");
    }

    return res.status(200).json(
        new ApiResponse(200, subscriber, "All subscriber  fetched successfully")
    );


})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params

    if(!subscriberId){
        throw new ApiError(400,"subscriber id required")
    }

    const filter={
        subscriber:subscriberId
    }

    const channels=await Subscription.find(filter).populate("channel")

    if(!channels || channels.length===0){
        throw new ApiError(404, "No channel  found");

    }
    
    const channelsWithSubscriberCount = await Promise.all(
        channels.map(async (sub) => {
            const count = await Subscription.countDocuments({ channel: sub.channel._id });
            return {
                ...sub.channel.toObject(),
                subscriberCount: count
            };
        }
    ));

        
    return res.status(200).json(new ApiResponse(200,channelsWithSubscriberCount,"All channels fetched successfully"))
    
    

})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels,
    
}

