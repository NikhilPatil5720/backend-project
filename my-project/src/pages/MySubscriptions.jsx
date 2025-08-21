// // src/pages/MySubscriptions.jsx
// import { useEffect, useState } from "react";
// import axiosInstance from "../utils/axiosInstance";

// export default function MySubscriptions() {
//   const [channels, setChannels] = useState([]);
  
//   // fetch subscriptions for the logged-in user
//   useEffect(() => {
//     const fetchSubscriptions = async () => {
//       try {
//         // use the userId from localStorage or get it from backend via JWT
//         const subscriberId = localStorage.getItem("userId"); 
//         if (!subscriberId) return;

//         const res = await axiosInstance.get(`/subscriptions/u/${subscriberId}`);
//         setChannels(res.data.data);
//       } catch (err) {
//         console.error("❌ Error fetching subscribed channels:", err);
//       }
//     };

//     fetchSubscriptions();
//   }, []);

//   return (
//     <div className="p-6">
//       <h2 className="text-xl font-bold mb-4">My Subscriptions</h2>
//       {channels.length === 0 ? (
//         <p>You haven't subscribed to any channels yet.</p>
//       ) : (
//         <ul className="space-y-3">
//           {channels.map((sub) => (
//             <li key={sub._id} className="flex items-center space-x-3">
//               <img
//                 src={sub.channel.avatar}
//                 alt={sub.channel.username}
//                 className="w-10 h-10 rounded-full"
//               />
//               <span>{sub.channel.username}</span>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }









import { useEffect, useState } from "react";
import api from "../utils/axiosInstance";

export default function MySubscriptions() {
  const [channels, setChannels] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const res = await api.get(`/subscriptions/u/${userId}`);
        setChannels(res.data.data);
      } catch (err) {
        console.error("❌ Error fetching subscribed channels:", err);
      }
    };
    if (userId) fetchChannels();
  }, [userId]);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">My Subscriptions</h2>
      {channels.length === 0 ? (
        <p>You haven't subscribed to any channels yet.</p>
      ) : (
        <ul className="space-y-3">
          {channels.map((ch) => (
            <li key={ch._id} className="flex items-center justify-between space-x-3">
              <div className="flex items-center space-x-3">
                <img
                  src={ch.avatar}
                  alt={ch.username}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <span className="font-medium">{ch.username}</span>
                  <p className="text-sm text-gray-500">{ch.subscriberCount} Subscribers</p>
                </div>
              </div>
              <button
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                onClick={async () => {
                  try {
                    await api.post(`/subscriptions/toggle/${ch._id}`);
                    // Refresh channels to update subscriber count
                    const res = await api.get(`/subscriptions/u/${userId}`);
                    setChannels(res.data.data);
                  } catch (err) {
                    console.error(err);
                  }
                }}
              >
                Unsubscribe
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
