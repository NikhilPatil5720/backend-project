// src/api/subscription.api.js
import api from "../utils/axiosInstance";

// Get all channels the user is subscribed to
export const getSubscribedChannels = async (userId) => {
  return await api.get(`/subscriptions/u/${userId}`);
};

// Toggle subscription (subscribe/unsubscribe)
export const toggleSubscription = async (channelId) => {
  return await api.post(`/subscriptions/toggle/${channelId}`);
};
