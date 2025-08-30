import axiosInstance from "../utils/axiosInstance";

// Toggle video like
export const toggleVideoLike = async (videoId) => {
  const res = await axiosInstance.post(`/likes/toggle/v/${videoId}`);
  return res.data;
};

// Toggle comment like
export const toggleCommentLike = async (commentId) => {
  const res = await axiosInstance.post(`/likes/toggle/c/${commentId}`);
  return res.data;
};

// Toggle tweet like
export const toggleTweetLike = async (tweetId) => {
  const res = await axiosInstance.post(`/likes/toggle/t/${tweetId}`);
  return res.data;
};

// Get liked videos
export const getLikedVideos = async () => {
  const res = await axiosInstance.get("/likes/videos");
  return res.data;
};
