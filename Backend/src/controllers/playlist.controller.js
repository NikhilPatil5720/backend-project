import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../model/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description,videoId} = req.body

    //TODO: create playlist

    if(!name  || !description){
        throw new ApiError(400,"name and description required to create new playlist")
    }

    
    if (!Array.isArray(videoId) || videoId.length === 0) {
        throw new ApiError(400, "At least one video ID is required");
    }
    
    
    
    const newplaylist= await Playlist.create(
        {name,
            description, 
            videofile: videoId,
            owner: req.user._id}
        )
        
        
        if(!newplaylist){
            throw new ApiError(404,"something went wrong while  creating new playlist")
        }
        
        return res.status(200).json(new ApiResponse(200,newplaylist,"new playlist creatd succesfully"))




        // you can also use this logic :  firstly upload on cloud every time and then create playlist ... 
        // here we are prefering video id from video model and taking that url to add that video to specific playlist   
    
    
        // const videoPath=req.files?.video[0]?.path;
    
        // if(!videoPath){
        //     throw new ApiError(400,"video path required")
        // }
    
        // const uploadedvideo= await uploadoncloudinary(videoPath)
        
        // if(!uploadedvideo){
        //     throw new ApiError(402,"Error while uploading video")
        // }
    })
    

const getUserPlaylists = asyncHandler(async (req, res) => {
        const {userId} = req.params
    //TODO: get user playlists


    if(!userId){
        throw new ApiError(400,"userId required to get playlist of user")
    }

    // const user= req.user._id
    // use this above when you want only fetch log in user playlist

    const playlist=await Playlist.find({owner:userId}).populate("videos")

    if(!playlist.length===0){
        throw new ApiError(402,"User dont have any video playlist")
    }

    return res.status(200).json(new ApiResponse(200,playlist,"User playlist fetched successfuly"))
})



const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id

    if (!playlistId) {
        throw new ApiError(400, "playlist ID is required to get playlists");
    }

    const playlists = await Playlist.findById(playlistId).populate("videos");
    // here you can directly also use FindById(playlist) insted of find({_id:playlist})

    if(!playlists){
        throw new ApiError(400,"playlist not found plz enter valid plalist id")
    }

    if (playlists.length === 0) {
        throw new ApiError(404, "playlists not have any video");
    }

    return res.status(200).json(new ApiResponse(200, playlists, " playlists fetched successfully"));
})






const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params

    if(!playlistId || !videoId){
        throw new ApiError(400,"playlistId and VideoId required to add video ")
    }

    //find the playlist by it PlaylistId
    const playlist=await Playlist.findById(playlistId)
    
    if(!playlist){
        throw new ApiError(404,"playlist not found")
    }

    //check if the video already exist in the same playlist
if (playlist.videos.includes(videoId)) {
        throw new ApiError(400, "Video already in playlist");
    }


    //to add video into playlist
   playlist.videos.push(videoId);
    await playlist.save();

    return res.status(200).json(new ApiResponse(200, playlist, "Video added to playlist successfully"));


})




const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist

    if(!playlistId || !videoId){
        throw new ApiError(400,"playlist id and videio id required to delete videio from playsist")
    }

    const playlist=await Playlist.findById(playlistId)
    if(!playlist){
        throw new ApiError(404,"playlist not found")
    }

    if(!playlist.videos.includes(videoId)){
        throw new ApiError(400,"video not found or already deleted")
    }


    // to remove video from specific playlist
    playlist.videos.pull(videoId)
    await playlist.save()


    return res.status(200).json(new ApiResponse(200, playlist, "Video deleted from playlist successfully"));

})





const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist

      if (!playlistId) {
        throw new ApiError(400, "playlistId  required to delete playlist");
    }


    //to delete the playlist
    const playlist = await Playlist.findByIdAndDelete(playlistId);
    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    return res.status(200).json(
        new ApiResponse(200, playlist, " playlist deleted successfully")
    );

})



const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist

    if(!playlistId){
        throw new ApiError(400,"playlistId require to update playlist")
    }

    if (!name && !description) {
        throw new ApiError(400, "At least one field (name or description) must be provided");
    }


    // to update the playlist
    const UpdatePlaylist= await Playlist.findByIdAndUpdate(
        playlistId,
    
        {
            $set:{
                name,description
            }
        },
        {
            new:true
        }
    )


    if(!UpdatePlaylist){
        throw new ApiError(404,"Playlist Not found")
    }

    return res.status(200).json(new ApiResponse(200,UpdatePlaylist,"Playlist updated succesfully"))
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}