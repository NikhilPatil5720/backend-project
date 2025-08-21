import mongoose from "mongoose"
import { Comment } from "../model/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asynchandler.js"

const getVideoComments = asyncHandler(async (req, res) => { 
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

    if(!videoId){
        throw new ApiError(205,"videoid required")
    }


        const skip = (parseInt(page) - 1) * parseInt(limit);

//          Real-World Example (Comment List)
// Let’s say you have 100 comments for a video, and you want to show 10 comments per page.
// Page 1 should show comments 1–10
// Page 2 → comments 11–20
// Page 3 → comments 21–30
// And so on...

// To do that, we use:
// limit = 10 (how many to show)
// page = 3 (which page the user asked for)
// Then calculate how many items to skip:
// → skip = (page - 1) * limit = (3 - 1) * 10 = 20

// So MongoDB skips the first 20 comments, and then returns the next 10.

    const getallcomment= await Comment.find({video:videoId}).skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 })
     .populate("owner", "_id username");  // 👈 this is key
 //  newest first


    return res.status(200)
    .json(new ApiResponse(200,getallcomment,"all comment fetched succesfully"))
})



const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video

    const{comment}=req.body
    const{videoId}=req.params


    if(!comment){
        throw new ApiError(400,"comment required")
    }

    const newcomment= await Comment.create({
        content:comment,
        video:videoId,
        owner:req.user._id
})

    if(!newcomment){
        throw new ApiError(202,"something went wrong while creating coment")
    }
    const createdcomment= await Comment.findById(newcomment?._id)

    return res.status(200)
    .json(new ApiResponse(200,createdcomment,"comment created succesfully"))
})




const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const{updatComment}=req.body
    const{commentId}=req.params

    if(!updatComment || !commentId){
        throw new ApiError(400,"all field required")

    }
    const updatedcomment= await Comment.findByIdAndUpdate(commentId,{
        $set:{content:updatComment}
    },{
        new:true
    })

    if(!updatedcomment){
        throw new ApiError(405,"comment not found")
    }
     
    return res.status(200)
    .json(new ApiResponse(200,updatedcomment,"comment updated succesfully"))
})




const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment

    const {commentId}=req.params

    if(!commentId){
        throw new ApiError(403,"comment id req")
    }

    const deletcomment= await Comment.findByIdAndDelete(commentId)

    if(!deletcomment){
        throw new ApiError(203,"comment not found or already deleted")
    }

    return res.status(200)
    .json(new ApiResponse(200,deletcomment,"comment deleted successfully"))
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }