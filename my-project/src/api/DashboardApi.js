// src/api/dashboardApi.js
import axiosInstance from "../utils/axiosInstance";

export const getChannelStats = async (channelId) => {
const res = await axios.get("/api/v1/dashboard/stats"); // JWT should be sent via cookie/header

  return res.data.data; // we only need the data part
};

export const getChannelVideos = async (channelId) => {
  const res = await axiosInstance.get(`/dashboard/videos?channelId=${channelId}`);
  return res.data.data;
};
