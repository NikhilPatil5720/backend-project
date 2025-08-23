import axiosInstance from "../utils/axiosInstance";

// Create a new tweet
export const createTweet = async (content) => {
  return axiosInstance.post("/tweets", { content });
};

// Get all user tweets
export const getUserTweets = async () => {
  return axiosInstance.get("/tweets/me");
};

// Update tweet
export const updateTweet = async (tweetId, newtweet) => {
  return axiosInstance.patch(`/tweets/${tweetId}`, { newtweet });
};

// Delete tweet
export const deleteTweet = async (tweetId) => {
  return axiosInstance.delete(`/tweets/${tweetId}`);
};


// (Optional) Get all tweets (if needed)
export const getAllTweets = async () => {
  return await axiosInstance.get("/tweets");
};