// import mongoose, { isValidObjectId } from "mongoose"
// import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Tweet } from "../model/tweet.model.js"



const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const {content}=req.body

    if(!content){
        throw new ApiError(205,"Tweet is required")
    }

    const tweet= await Tweet.create({
       content:content,
       owner:req.user._id
    })

    
    if(!tweet){
        throw new ApiError(404,"something went wrong while creating tweet")
    }
    const createdtweet=await Tweet.findById(tweet._id)
    

    return res.status(200)
    .json(new ApiResponse(200,createdtweet,"Tweet created successfully"))
})


    


const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets

    const userId=req.user?._id
    
    if(!userId){
        throw new ApiError(400,"Unauthorise access")
    }

    const userTweet= await Tweet.find({owner:userId})

    return res.status(200)
    .json(new ApiResponse(200,userTweet,"user tweet fetch succesfully"))

})





const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const {newtweet} = req.body
    const { tweetId } = req.params;

    
    if(!newtweet){
        throw new ApiError(406,"All field required")
    }

    const updatedTweet= await Tweet.findByIdAndUpdate(
         tweetId,
        {
            $set :{ content:newtweet }
        },{
            new:true
        }
    )

    if(!updatedTweet){
        throw new ApiError(405,"tweet not found")
    }

    return res.status(200)
    .json(new ApiResponse(200,updatedTweet,"Tweet updated succesfully"))


})




const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet

    const{tweetId}=req.params

    if(!tweetId){
        throw new ApiError(404,"tweet id required to delet tweet")
    }

    const delettweet= await Tweet.findByIdAndDelete(tweetId)

    if (!delettweet) {
    throw new ApiError(404, "Tweet not found or already deleted");
}
    
    return res.status(200)
    .json(new ApiResponse(200,delettweet,"Tweet deleted succesfully"))

})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}