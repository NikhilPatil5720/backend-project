
// import { useEffect, useState } from "react";
// import api from "../utils/axiosInstance";
// import { Card, CardContent } from "@/components/ui/card";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";

// export default function MySubscriptions() {
//   const [channels, setChannels] = useState([]);
//   const userId = localStorage.getItem("userId");

//   useEffect(() => {
//     const fetchChannels = async () => {
//       try {
//         const res = await api.get(`/subscriptions/u/${userId}`);
//         setChannels(res.data.data);
//       } catch (err) {
//         console.error("❌ Error fetching subscribed channels:", err);
//       }
//     };
//     if (userId) fetchChannels();
//   }, [userId]);

//   return (
//     <div className="p-6 max-w-4xl ">
//       <h2 className="text-2xl font-bold mb-6">My Subscriptions</h2>

//       {channels.length === 0 ? (
//         <p className="text-gray-500">You haven't subscribed to any channels yet.</p>
//       ) : (
//         <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
//           {channels.map((ch) => (
//             <Card key={ch._id} className="shadow-md hover:shadow-lg transition rounded-xl">
//               <CardContent className="flex flex-col items-center p-4">
//                 {/* Avatar */}
//                 <Avatar className="w-16 h-16 mb-3">
//                   <AvatarImage src={ch.avatar} alt={ch.username} />
//                   <AvatarFallback>{ch.username?.charAt(0)}</AvatarFallback>
//                 </Avatar>

//                 {/* Channel Info */}
//                 <h3 className="font-semibold text-lg">{ch.username}</h3>
//                 <p className="text-sm text-gray-500 mb-4">
//                   {ch.subscriberCount} Subscribers
//                 </p>

//                 {/* Unsubscribe Button */}
//                 <Button
//                   variant="destructive"
//                   className="w-full"
//                   onClick={async () => {
//                     try {
//                       await api.post(`/subscriptions/toggle/${ch._id}`);
//                       const res = await api.get(`/subscriptions/u/${userId}`);
//                       setChannels(res.data.data);
//                     } catch (err) {
//                       console.error(err);
//                     }
//                   }}
//                 >
//                   Unsubscribe
//                 </Button>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }









// try errors
import { useEffect, useState } from "react";
import { getSubscribedChannels, toggleSubscription } from "../api/subscriptionApi.js";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function MySubscriptions() {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState({});
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const res = await getSubscribedChannels(userId);
        setChannels(res.data.data);
      } catch (err) {
        console.error("❌ Error fetching subscribed channels:", err);
      }
    };
    if (userId) fetchChannels();
  }, [userId]);

  const handleToggleSubscription = async (channelId) => {
    setLoading((prev) => ({ ...prev, [channelId]: true }));
    try {
      const res = await toggleSubscription(channelId);
      console.log(res.data.message);

      if (res.data.message.includes("unsubscribed")) {
        setChannels((prev) => prev.filter((ch) => ch._id !== channelId));
      }
    } catch (err) {
      console.error("❌ Error toggling subscription:", err);
    } finally {
      setLoading((prev) => ({ ...prev, [channelId]: false }));
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">My Subscriptions</h2>

      {channels.length === 0 ? (
        <p className="text-gray-500">You haven't subscribed to any channels yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {channels.map((ch) => (
            <Card key={ch._id} className="shadow-md hover:shadow-lg transition rounded-xl">
              <CardContent className="flex flex-col items-center p-4">
                <Avatar className="w-16 h-16 mb-3">
                  <AvatarImage src={ch.avatar} alt={ch.username} />
                  <AvatarFallback>{ch.username?.charAt(0)}</AvatarFallback>
                </Avatar>

                <h3 className="font-semibold text-lg">{ch.username}</h3>
                <p className="text-sm text-gray-500 mb-4">{ch.subscriberCount} Subscribers</p>

                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => handleToggleSubscription(ch._id)}
                  disabled={loading[ch._id]}
                >
                  {loading[ch._id] ? "Processing..." : "Unsubscribe"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
