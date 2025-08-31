import { useState, useEffect } from "react";
import api from "../api/axios";

export default function SubscribeButton({ channelId }) {
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    // Optionally: check if already subscribed
  }, [channelId]);

  const toggleSubscription = async () => {
    try {
      const res = await api.post(`/subscriptions/toggle/${channelId}`);
      setSubscribed(!subscribed);
      alert(res.data.message);
    } catch (err) {
      console.error("❌ Subscription error:", err);
    }
  };

  return (
    <button
      onClick={toggleSubscription}
      className={`px-4 py-2 rounded-lg text-white ${subscribed ? "bg-gray-500" : "bg-red-600"
        }`}
    >
      {subscribed ? "Subscribed" : "Subscribe"}
    </button>
  );
}
