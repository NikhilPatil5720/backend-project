import mongoose, {isValidObjectId} from "mongoose"
import {Video} from  "../model/video.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadoncloudinary} from "../utils/cloudinary.js"

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;

  const filter = { isPublished: true }; // only public videos

  if (userId) {
    filter.owner = userId; // optional: show videos by specific user
  }

  if (query) {
    filter.title = { $regex: query, $options: "i" };
  }

  const videos = await Video.find(filter)
    .populate("owner", "username email")  // populate owner with username (and email if you want)
    .sort({ [sortBy]: sortType === "asc" ? 1 : -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  if (!videos.length) {
    return res.status(200).json({ message: "No videos found", data: [] });
  }

  return res.status(200).json({ message: "Videos fetched successfully", data: videos });
});




 const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    throw new ApiError(400, "Title and description are mandatory");
  }

  // Get video and thumbnail files from user
  const videolocalpath = req.files?.videoFile?.[0]?.path;
  const thumbnaillocalpath = req.files?.thumbnail?.[0]?.path;

  if (!videolocalpath) {
    throw new ApiError(400, "Video file is required");
  }
  if (!thumbnaillocalpath) {
    throw new ApiError(400, "Thumbnail is required");
  }

  // Upload video to Cloudinary (ensure resource_type: "video")
  const video = await uploadoncloudinary(videolocalpath, { resource_type: "video" });
  const thumbnail = await uploadoncloudinary(thumbnaillocalpath);

  if (!video) {
    throw new ApiError(502, "Error uploading video to Cloudinary");
  }
  if (!thumbnail) {
    throw new ApiError(502, "Error uploading thumbnail to Cloudinary");
  }

  // Create video in MongoDB
  const videocreated = await Video.create({
   videofile: video.secure_url,  // lowercase matches model
    thumbnail: thumbnail.url || "",
    owner: req.user._id,
    title,
    description,
    isPublished: true,
    duration: 0, // placeholder, you can calculate actual duration if needed
  });

  const createdVideo = await Video.findById(videocreated._id).populate("owner", "username email");

  if (!createdVideo) {
    throw new ApiError(504, "Something went wrong while creating video");
  }

  return res.status(201).json(
    new ApiResponse(201, createdVideo, "Video uploaded and published successfully")
  );
});


const incrementViews = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    video.views += 1;
    await video.save();

    res.status(200).json({ success: true, views: video.views });
});

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
    
    if(!videoId){
        throw new ApiError(400,"video Id require")
    }

     // Validate ObjectId format(optional ahe)
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID format");
    }


    const video= await Video.findById(videoId).populate("owner", "username email");
    if(!video){
        throw new ApiError(404,"video not found. plz give valid video Id")
    }

    return res.status(200).json(new ApiResponse(200,video,"video fetch successfully"))
})



const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { title, description } = req.body;

    if (!videoId) throw new ApiError(400, "Video ID is required");

    const video = await Video.findById(videoId);
    if (!video) throw new ApiError(404, "Video not found");

    // Only owner can update
    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to update this video");
    }

    // Update title/description if provided
    if (title) video.title = title;
    if (description) video.description = description;

    // Update thumbnail if uploaded
    if (req.file) {
        const uploadedThumb = await uploadoncloudinary(req.file.path);
        if (!uploadedThumb) throw new ApiError(400, "Thumbnail upload failed");
        video.thumbnail = uploadedThumb.url;
    }

    await video.save();

    return res.status(200).json(
        new ApiResponse(200, video, "Video updated successfully")
    );
});


const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!videoId) throw new ApiError(400, "Video ID required");

    const video = await Video.findById(videoId);
    if (!video) throw new ApiError(404, "Video not found");

    // Only owner can delete
    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this video");
    }

    await video.deleteOne(); // now delete

    return res.status(200).json(new ApiResponse(200, null, "Video deleted successfully"));
});




const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if(!videoId){
        throw new ApiError(400,"video Id require")
    }

    const video =await Video.findById(videoId)
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    // Toggle publish status
    video.isPublished = !video.isPublished;
    await video.save();

    return res.status(200).json(
        new ApiResponse(200, video, `Video ${video.isPublished ? "Published" : "Unpublished"} successfully`)
    );
})



 const getMyVideos = asyncHandler(async (req, res) => {
  console.log(req.user._id)
  const videos = await Video.find({ owner: req.user._id }).populate("owner", "username email");
  res.status(200).json({ message: "My videos fetched", data: videos });
});

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
    incrementViews,
    getMyVideos
}