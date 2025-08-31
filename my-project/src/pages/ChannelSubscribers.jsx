import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

export default function ChannelSubscribers() {
  const { channelId } = useParams();
  const [subscribers, setSubscribers] = useState([]);

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const res = await api.get(`/subscriptions/c/${channelId}`);
        setSubscribers(res.data.data);
      } catch (err) {
        console.error("❌ Error fetching subscribers:", err);
      }
    };
    fetchSubscribers();
  }, [channelId]);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Subscribers</h2>
      {subscribers.length === 0 ? (
        <p>No subscribers yet.</p>
      ) : (
        <ul className="space-y-2">
          {subscribers.map((sub) => (
            <li key={sub._id} className="flex items-center space-x-3">
              <img
                src={sub.subscriber.avatar}
                alt={sub.subscriber.username}
                className="w-10 h-10 rounded-full"
              />
              <span>{sub.subscriber.username}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
