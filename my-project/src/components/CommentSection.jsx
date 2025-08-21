// // //version 3---- delete button 
// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axiosInstance from "../utils/axiosInstance";


// const CommentSection = () => {
//   const { videoId } = useParams();
//   const [video, setVideo] = useState(null);
//   const [comments, setComments] = useState([]);
//   const [newComment, setNewComment] = useState("");
//   const [editingCommentId, setEditingCommentId] = useState(null);
//   const [editText, setEditText] = useState("");
//   const [currentUserId, setCurrentUserId] = useState(null);

//   // 👤 Fetch current logged-in user
//   useEffect(() => {
//     const fetchMe = async () => {
//       try {
//         const res = await axiosInstance.get("/users/getcurrentuser"); 
//         setCurrentUserId(res.data.data._id);
//         console.log("✅ Current user:", res.data.data);
//       } catch (err) {
//         console.error("❌ Error fetching user:", err);
//       }
//     };
//     fetchMe();
//   }, []);

//   // 🎥 Fetch video + increment views
//   useEffect(() => {
//     if (!videoId) return;

//     const fetchVideo = async () => {
//       try {
//         const res = await axiosInstance.get(`/videos/${videoId}`);
//         setVideo(res.data.data);

//         await axiosInstance.patch(`/videos/views/${videoId}`);
//       } catch (err) {
//         console.error("❌ Error fetching video:", err);
//       }
//     };

//     fetchVideo();
//   }, [videoId]);

//   // 💬 Fetch comments
//   useEffect(() => {
//     if (!videoId) return;
//     const fetchComments = async () => {
//       try {
//         const res = await axiosInstance.get(`/comments/${videoId}`);
//         console.log("✅ Comments fetched:", res.data.data);
//         setComments(res.data.data || []);
//       } catch (err) {
//         console.error("❌ Error fetching comments:", err);
//       }
//     };
//     fetchComments();
//   }, [videoId]);

//   // ➕ Add comment
//   const handleAddComment = async () => {
//     if (!newComment) return alert("Comment cannot be empty");
//     try {
//       const res = await axiosInstance.post(`/comments/${videoId}`, {
//         comment: newComment,
//       });
//       setComments((prev) => [res.data.data, ...prev]);
//       setNewComment("");
//     } catch (err) {
//       console.error("❌ Error adding comment:", err);
//     }
//   };

//   // ✏️ Start editing comment
//   const handleEditClick = (comment) => {
//     setEditingCommentId(comment._id);
//     setEditText(comment.content);
//   };

//   // 💾 Save updated comment
//   const handleUpdateComment = async (id) => {
//     try {
//       const res = await axiosInstance.patch(`/comments/${id}`, {
//       updatComment: editText,   // 🔑 must match backend
        
//       });

//       setComments((prev) =>
//         prev.map((c) => (c._id === id ? res.data.data : c))
//       );
//       setEditingCommentId(null);
//       setEditText("");
//     } catch (err) {
//       console.error("❌ Error updating comment:", err);
//     }
//   };

//   // ❌ Delete comment
//   const handleDeleteComment = async (id) => {
//     try {
//       await axiosInstance.delete(`/comments/${id}`);
//       setComments((prev) => prev.filter((c) => c._id !== id));
//     } catch (err) {
//       console.error("❌ Error deleting comment:", err);
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-4">
//       {/* 🎥 Video */}
//       {video ? (
//         <video
//           src={video.videoUrl || video.videofile}
//           controls
//           autoPlay
//           className="w-full rounded-lg shadow-md"
//         />
//       ) : (
//         <p className="text-center">Loading video...</p>
//       )}

//       {/* ℹ️ Video Info */}
//       {video && (
//         <div className="mt-4">
//           <h2 className="text-xl font-bold">{video.title}</h2>
//           <p className="text-gray-600">{video.description}</p>
//           <p className="text-sm text-gray-500 mt-1">
//             👁 {video.views} views • 👍 {video.likes} likes
//           </p>
//         </div>
//       )}

//       {/* ➕ Comment Box */}
//       <div className="mt-6">
//         <h3 className="text-lg font-semibold mb-2">Add Comment</h3>
//         <textarea
//           className="w-full border rounded-lg p-2"
//           value={newComment}
//           onChange={(e) => setNewComment(e.target.value)}
//           placeholder="Write your comment..."
//         />
//         <button
//           onClick={handleAddComment}
//           className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
//         >
//           Submit
//         </button>
//       </div>

//       {/* 💬 Comments */}
//       <div className="mt-6">
//         <h3 className="text-lg font-semibold mb-2">Comments</h3>
//         {comments.length === 0 ? (
//           <p className="text-gray-500">No comments yet.</p>
//         ) : (
//           comments.map((c) => (
//             <div
//               key={c._id}
//               className="border-b py-2 flex flex-col gap-1"
//             >
//               {editingCommentId === c._id ? (
//                 <>
//                   <textarea
//                     className="w-full border rounded-lg p-2"
//                     value={editText}
//                     onChange={(e) => setEditText(e.target.value)}
//                   />
//                   <div className="flex gap-2 mt-1">
//                     <button
//                       onClick={() => handleUpdateComment(c._id)}
//                       className="px-3 py-1 bg-green-600 text-white rounded"
//                     >
//                       Save
//                     </button>
//                     <button
//                       onClick={() => setEditingCommentId(null)}
//                       className="px-3 py-1 bg-gray-400 text-white rounded"
//                     >
//                       Cancel
//                     </button>
//                   </div>
//                 </>
//               ) : (
//                 <>
//                   <p>{c.content}</p>
//                   <small className="text-gray-500">
//                     By: {c.owner?.username} ({c.owner?._id})
//                   </small>

//                   {/* Show buttons only if current user is owner */}
//                   {c.owner?._id === currentUserId && (
//                     <div className="flex gap-2 mt-1">
//                       <button
//                         onClick={() => handleEditClick(c)}
//                         className="px-3 py-1 bg-yellow-500 text-white rounded"
//                       >
//                         Edit
//                       </button>
//                       <button
//                         onClick={() => handleDeleteComment(c._id)}
//                         className="px-3 py-1 bg-red-600 text-white rounded"
//                       >
//                         Delete
//                       </button>
//                     </div>
//                   )}


//                 </>
//               )}
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default CommentSection;


















import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const CommentSection = () => {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);

  // 🔔 Subscription state
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loadingSub, setLoadingSub] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState(0); // ✅ new state

  // 👤 Fetch current logged-in user
  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await axiosInstance.get("/users/getcurrentuser");
        setCurrentUserId(res.data.data._id);
      } catch (err) {
        console.error("❌ Error fetching user:", err);
      }
    };
    fetchMe();
  }, []);

  // 🎥 Fetch video + increment views
  useEffect(() => {
    if (!videoId) return;

    const fetchVideo = async () => {
      try {
        const res = await axiosInstance.get(`/videos/${videoId}`);
        setVideo(res.data.data);

        await axiosInstance.patch(`/videos/views/${videoId}`);
      } catch (err) {
        console.error("❌ Error fetching video:", err);
      }
    };

    fetchVideo();
  }, [videoId]);

  // 🔍 Check subscription status and fetch subscriber count
  useEffect(() => {
    if (!video?.owner?._id || !currentUserId) return;

    const fetchSubscriptionInfo = async () => {
      try {
        const res = await axiosInstance.get(`/subscriptions/c/${video.owner._id}`);
        const subs = res.data.data || [];

        // check if current user is subscribed
        const subscribed = subs.some((sub) => sub.subscriber._id === currentUserId);
        setIsSubscribed(subscribed);

        // update subscriber count
        setSubscriberCount(subs.length);
      } catch (err) {
        console.error("❌ Error fetching subscription info:", err);
      }
    };

    fetchSubscriptionInfo();
  }, [video, currentUserId]);

  // 🔔 Toggle subscription
  const handleToggleSub = async () => {
    if (!video?.owner?._id) return;
    setLoadingSub(true);
    try {
      await axiosInstance.post(`/subscriptions/toggle/${video.owner._id}`);
      setIsSubscribed(!isSubscribed);

      // adjust subscriber count locally
      setSubscriberCount((prev) => (isSubscribed ? prev - 1 : prev + 1));
    } catch (err) {
      console.error("❌ Error toggling subscription:", err);
    } finally {
      setLoadingSub(false);
    }
  };

  // 💬 Fetch comments
  useEffect(() => {
    if (!videoId) return;
    const fetchComments = async () => {
      try {
        const res = await axiosInstance.get(`/comments/${videoId}`);
        setComments(res.data.data || []);
      } catch (err) {
        console.error("❌ Error fetching comments:", err);
      }
    };
    fetchComments();
  }, [videoId]);

  // ➕ Add comment
  const handleAddComment = async () => {
    if (!newComment) return alert("Comment cannot be empty");
    try {
      const res = await axiosInstance.post(`/comments/${videoId}`, {
        comment: newComment,
      });
      setComments((prev) => [res.data.data, ...prev]);
      setNewComment("");
    } catch (err) {
      console.error("❌ Error adding comment:", err);
    }
  };

  // ✏️ Start editing comment
  const handleEditClick = (comment) => {
    setEditingCommentId(comment._id);
    setEditText(comment.content);
  };

  // 💾 Save updated comment
  const handleUpdateComment = async (id) => {
    try {
      const res = await axiosInstance.patch(`/comments/${id}`, {
        updatComment: editText, // 🔑 must match backend
      });

      setComments((prev) =>
        prev.map((c) => (c._id === id ? res.data.data : c))
      );
      setEditingCommentId(null);
      setEditText("");
    } catch (err) {
      console.error("❌ Error updating comment:", err);
    }
  };

  // ❌ Delete comment
  const handleDeleteComment = async (id) => {
    try {
      await axiosInstance.delete(`/comments/${id}`);
      setComments((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error("❌ Error deleting comment:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* 🎥 Video */}
      {video ? (
        <video
          src={video.videoUrl || video.videofile}
          controls
          autoPlay
          className="w-full rounded-lg shadow-md"
        />
      ) : (
        <p className="text-center">Loading video...</p>
      )}

      {/* ℹ️ Video Info */}
      {video && (
        <div className="mt-4">
          <h2 className="text-xl font-bold">{video.title}</h2>
          <p className="text-gray-600">{video.description}</p>
          <p className="text-sm text-gray-500 mt-1">
            👁 {video.views} views • 👍 {video.likes} likes
          </p>

          {/* 🔔 Subscribe button with subscriber count */}
          <div className="mt-3 flex items-center gap-3">
            <button
              onClick={handleToggleSub}
              disabled={loadingSub}
              className={`px-4 py-2 rounded-lg text-white ${
                isSubscribed
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loadingSub
                ? "Processing..."
                : isSubscribed
                ? "Unsubscribe"
                : "Subscribe"}
            </button>
            <span className="text-gray-700">
              {subscriberCount} subscriber{subscriberCount !== 1 && "s"}
            </span>
          </div>
        </div>
      )}

      {/* ➕ Comment Box */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Add Comment</h3>
        <textarea
          className="w-full border rounded-lg p-2"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write your comment..."
        />
        <button
          onClick={handleAddComment}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Submit
        </button>
      </div>

      {/* 💬 Comments */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Comments</h3>
        {comments.length === 0 ? (
          <p className="text-gray-500">No comments yet.</p>
        ) : (
          comments.map((c) => (
            <div key={c._id} className="border-b py-2 flex flex-col gap-1">
              {editingCommentId === c._id ? (
                <>
                  <textarea
                    className="w-full border rounded-lg p-2"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                  />
                  <div className="flex gap-2 mt-1">
                    <button
                      onClick={() => handleUpdateComment(c._id)}
                      className="px-3 py-1 bg-green-600 text-white rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingCommentId(null)}
                      className="px-3 py-1 bg-gray-400 text-white rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p>{c.content}</p>
                  <small className="text-gray-500">
                    By: {c.owner?.username} ({c.owner?._id})
                  </small>

                  {/* Show buttons only if current user is owner */}
                  {c.owner?._id === currentUserId && (
                    <div className="flex gap-2 mt-1">
                      <button
                        onClick={() => handleEditClick(c)}
                        className="px-3 py-1 bg-yellow-500 text-white rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteComment(c._id)}
                        className="px-3 py-1 bg-red-600 text-white rounded"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
