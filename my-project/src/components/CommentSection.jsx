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

//   // 🔔 Subscription state
//   const [isSubscribed, setIsSubscribed] = useState(false);
//   const [loadingSub, setLoadingSub] = useState(false);
//   const [subscriberCount, setSubscriberCount] = useState(0); // ✅ new state




//   // 👤 Fetch current logged-in user
//   useEffect(() => {
//     const fetchMe = async () => {
//       try {
//         const res = await axiosInstance.get("/users/getcurrentuser");
//         setCurrentUserId(res.data.data._id);
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

//   // 🔍 Check subscription status and fetch subscriber count
//   useEffect(() => {
//     if (!video?.owner?._id || !currentUserId) return;

//     const fetchSubscriptionInfo = async () => {
//       try {
//         const res = await axiosInstance.get(`/subscriptions/c/${video.owner._id}`);
//         const subs = res.data.data || [];

//         // check if current user is subscribed
//         const subscribed = subs.some((sub) => sub.subscriber._id === currentUserId);
//         setIsSubscribed(subscribed);

//         // update subscriber count
//         setSubscriberCount(subs.length);
//       } catch (err) {
//         console.error("❌ Error fetching subscription info:", err);
//       }
//     };

//     fetchSubscriptionInfo();
//   }, [video, currentUserId]);

//   // 🔔 Toggle subscription
//   const handleToggleSub = async () => {
//     if (!video?.owner?._id) return;
//     setLoadingSub(true);
//     try {
//       await axiosInstance.post(`/subscriptions/toggle/${video.owner._id}`);
//       setIsSubscribed(!isSubscribed);

//       // adjust subscriber count locally
//       setSubscriberCount((prev) => (isSubscribed ? prev - 1 : prev + 1));
//     } catch (err) {
//       console.error("❌ Error toggling subscription:", err);
//     } finally {
//       setLoadingSub(false);
//     }
//   };

//   // 💬 Fetch comments
//   useEffect(() => {
//     if (!videoId) return;
//     const fetchComments = async () => {
//       try {
//         const res = await axiosInstance.get(`/comments/${videoId}`);
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
//         updatComment: editText, // 🔑 must match backend
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

//           {/* 🔔 Subscribe button with subscriber count */}
//           <div className="mt-3 flex items-center gap-3">
//             <button
//               onClick={handleToggleSub}
//               disabled={loadingSub}
//               className={`px-4 py-2 rounded-lg text-white ${
//                 isSubscribed
//                   ? "bg-red-600 hover:bg-red-700"
//                   : "bg-blue-600 hover:bg-blue-700"
//               }`}
//             >
//               {loadingSub
//                 ? "Processing..."
//                 : isSubscribed
//                 ? "Unsubscribe"
//                 : "Subscribe"}
//             </button>
//             <span className="text-gray-700">
//               {subscriberCount} subscriber{subscriberCount !== 1 && "s"}
//             </span>
//           </div>
          
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
//             <div key={c._id} className="border-b py-2 flex flex-col gap-1">
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










// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axiosInstance from "../utils/axiosInstance";
// import { getAllPlaylists, addVideoToPlaylist, createPlaylist } from "../api/playlistApi";

// const CommentSection = () => {
//   const { videoId } = useParams();
//   const [video, setVideo] = useState(null);
//   const [comments, setComments] = useState([]);
//   const [newComment, setNewComment] = useState("");
//   const [editingCommentId, setEditingCommentId] = useState(null);
//   const [editText, setEditText] = useState("");
//   const [currentUserId, setCurrentUserId] = useState(null);

//   const [isSubscribed, setIsSubscribed] = useState(false);
//   const [loadingSub, setLoadingSub] = useState(false);
//   const [subscriberCount, setSubscriberCount] = useState(0);

//   // ========== Playlist state ==========
//   const [playlists, setPlaylists] = useState([]);
//   const [selectedPlaylists, setSelectedPlaylists] = useState({});
//   const [showPlaylistDropdown, setShowPlaylistDropdown] = useState(false);
//   const [showNewPlaylistInput, setShowNewPlaylistInput] = useState(false);
//   const [newPlaylistName, setNewPlaylistName] = useState("");
//   const [confirmation, setConfirmation] = useState("");

//   // 👤 Fetch current logged-in user
//   useEffect(() => {
//     const fetchMe = async () => {
//       try {
//         const res = await axiosInstance.get("/users/getcurrentuser");
//         setCurrentUserId(res.data.data._id);
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

//   // 🔔 Subscribe logic omitted (unchanged)
//   useEffect(() => {
//     if (!video?.owner?._id || !currentUserId) return;
//     const fetchSubscriptionInfo = async () => {
//       try {
//         const res = await axiosInstance.get(`/subscriptions/c/${video.owner._id}`);
//         const subs = res.data.data || [];
//         const subscribed = subs.some((sub) => sub.subscriber._id === currentUserId);
//         setIsSubscribed(subscribed);
//         setSubscriberCount(subs.length);
//       } catch (err) {
//         console.error("❌ Error fetching subscription info:", err);
//       }
//     };
//     fetchSubscriptionInfo();
//   }, [video, currentUserId]);

//   const handleToggleSub = async () => {
//     if (!video?.owner?._id) return;
//     setLoadingSub(true);
//     try {
//       await axiosInstance.post(`/subscriptions/toggle/${video.owner._id}`);
//       setIsSubscribed(!isSubscribed);
//       setSubscriberCount((prev) => (isSubscribed ? prev - 1 : prev + 1));
//     } catch (err) {
//       console.error("❌ Error toggling subscription:", err);
//     } finally {
//       setLoadingSub(false);
//     }
//   };

//   // 💬 Comment logic unchanged
//   useEffect(() => {
//     if (!videoId) return;
//     const fetchComments = async () => {
//       try {
//         const res = await axiosInstance.get(`/comments/${videoId}`);
//         setComments(res.data.data || []);
//       } catch (err) {
//         console.error("❌ Error fetching comments:", err);
//       }
//     };
//     fetchComments();
//   }, [videoId]);

//   const handleAddComment = async () => {
//     if (!newComment) return alert("Comment cannot be empty");
//     try {
//       const res = await axiosInstance.post(`/comments/${videoId}`, { comment: newComment });
//       setComments((prev) => [res.data.data, ...prev]);
//       setNewComment("");
//     } catch (err) {
//       console.error("❌ Error adding comment:", err);
//     }
//   };

//   const handleEditClick = (comment) => {
//     setEditingCommentId(comment._id);
//     setEditText(comment.content);
//   };

//   const handleUpdateComment = async (id) => {
//     try {
//       const res = await axiosInstance.patch(`/comments/${id}`, { updatComment: editText });
//       setComments((prev) => prev.map((c) => (c._id === id ? res.data.data : c)));
//       setEditingCommentId(null);
//       setEditText("");
//     } catch (err) {
//       console.error("❌ Error updating comment:", err);
//     }
//   };

//   const handleDeleteComment = async (id) => {
//     try {
//       await axiosInstance.delete(`/comments/${id}`);
//       setComments((prev) => prev.filter((c) => c._id !== id));
//     } catch (err) {
//       console.error("❌ Error deleting comment:", err);
//     }
//   };

//   // ========== Playlist functionality ==========
//   const fetchPlaylists = async () => {
//     try {
//       const res = await getAllPlaylists(currentUserId);
//       const pls = res.data.data || [];
//       setPlaylists(pls);

//       const initial = {};
//       pls.forEach((pl) => (initial[pl._id] = false));
//       setSelectedPlaylists(initial);
//     } catch (err) {
//       console.error("Error fetching playlists:", err);
//     }
//   };

  

//   const handleTogglePlaylist = (plId) => {
//     setSelectedPlaylists((prev) => ({ ...prev, [plId]: !prev[plId] }));
//   };

//   // const handleCreatePlaylist = async () => {
//   //   if (!newPlaylistName.trim()) return;
//   //   try {
//   //     const res = await createPlaylist({ name: newPlaylistName });
//   //     const newPl = res.data.data;
//   //     setPlaylists((prev) => [...prev, newPl]);
//   //     setSelectedPlaylists((prev) => ({ ...prev, [newPl._id]: true }));
//   //     setNewPlaylistName("");
//   //     setShowNewPlaylistInput(false);
//   //   } catch (err) {
//   //     console.error("Error creating playlist:", err);
//   //   }
//   // };



//   const handleCreatePlaylist = async () => {
//   if (!newPlaylistName.trim()) return;

//   try {
//     // pass string directly, NOT object
//     const res = await createPlaylist(newPlaylistName);
//     const newPl = res.data.data; // backend returns {status, data, message}

//     setPlaylists((prev) => [...prev, newPl]);
//     setSelectedPlaylists((prev) => ({ ...prev, [newPl._id]: true }));
//     setNewPlaylistName("");
//     setShowNewPlaylistInput(false);
//   } catch (err) {
//     console.error("Error creating playlist:", err);
//   }
// };



//   const handleSaveToPlaylists = async () => {
//     const selectedIds = Object.keys(selectedPlaylists).filter((id) => selectedPlaylists[id]);
//     if (selectedIds.length === 0) return alert("Select at least one playlist");

//     try {
//       for (let plId of selectedIds) {
//         await addVideoToPlaylist(plId, videoId);
//       }
//       setConfirmation(`Video saved to ${selectedIds.length} playlist(s) successfully!`);
//       setShowPlaylistDropdown(false);
//     } catch (err) {
//       console.error("Error saving video to playlists:", err);
//     }
//   };

//   const handleOpenPlaylistDropdown = () => {
//     fetchPlaylists();
//     setShowPlaylistDropdown(true);
//     setConfirmation("");
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-4">
//       {/* 🎥 Video */}
//       {video ? (
//         <video src={video.videoUrl || video.videofile} controls autoPlay className="w-full rounded-lg shadow-md" />
//       ) : (
//         <p className="text-center">Loading video...</p>
//       )}

//       {/* ℹ️ Video Info */}
//       {video && (
//         <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:gap-4">
//           <div className="flex items-center gap-3">
//             {/* Subscribe Button */}
//             <button
//               onClick={handleToggleSub}
//               disabled={loadingSub}
//               className={`px-4 py-2 rounded-lg text-white ${
//                 isSubscribed ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"
//               }`}
//             >
//               {loadingSub ? "Processing..." : isSubscribed ? "Unsubscribe" : "Subscribe"}
//             </button>

//             {/* Save to Playlist Button */}
//             <div className="relative">
//               <button
//                 onClick={handleOpenPlaylistDropdown}
//                 className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
//               >
//                 Save to Playlist
//               </button>

//               {/* Playlist Dropdown */}
//               {showPlaylistDropdown && (
//                 <div className="absolute top-full left-0 mt-2 w-64 bg-white border rounded shadow-lg p-3 z-10">
//                   {playlists.map((pl) => (
//                     <div key={pl._id} className="flex items-center gap-2 mb-1">
//                       <input
//                         type="checkbox"
//                         checked={selectedPlaylists[pl._id] || false}
//                         onChange={() => handleTogglePlaylist(pl._id)}
//                       />
//                       <span>{pl.name}</span>
//                     </div>
//                   ))}

//                   {showNewPlaylistInput ? (
//                     <div className="flex gap-2 mt-2">
//                       <input
//                         type="text"
//                         placeholder="New playlist name"
//                         value={newPlaylistName}
//                         onChange={(e) => setNewPlaylistName(e.target.value)}
//                         className="border rounded px-2 py-1 flex-1"
//                       />
//                       <button
//                         onClick={handleCreatePlaylist}
//                         className="bg-blue-600 text-white px-2 py-1 rounded"
//                       >
//                         Create
//                       </button>
//                     </div>
//                   ) : (
//                     <button
//                       onClick={() => setShowNewPlaylistInput(true)}
//                       className="mt-2 text-green-600 flex items-center gap-1 hover:text-green-800"
//                     >
//                       + New Playlist
//                     </button>
//                   )}

//                   <button
//                     onClick={handleSaveToPlaylists}
//                     className="mt-2 w-full bg-green-600 text-white px-3 py-1 rounded"
//                   >
//                     Save
//                   </button>

//                   {confirmation && (
//                     <p className="text-sm text-green-700 mt-2">{confirmation}</p>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
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
//             <div key={c._id} className="border-b py-2 flex flex-col gap-1">
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














// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axiosInstance from "../utils/axiosInstance";
// import { getAllPlaylists, addVideoToPlaylist, createPlaylist } from "../api/playlistApi";

// const CommentSection = () => {
//   const { videoId } = useParams();
//   const [video, setVideo] = useState(null);
//   const [comments, setComments] = useState([]);
//   const [newComment, setNewComment] = useState("");
//   const [editingCommentId, setEditingCommentId] = useState(null);
//   const [editText, setEditText] = useState("");
//   const [currentUserId, setCurrentUserId] = useState(null);

//   const [isSubscribed, setIsSubscribed] = useState(false);
//   const [loadingSub, setLoadingSub] = useState(false);
//   const [subscriberCount, setSubscriberCount] = useState(0);

//   // ========== Playlist state ==========
//   const [playlists, setPlaylists] = useState([]);
//   const [selectedPlaylists, setSelectedPlaylists] = useState({});
//   const [showPlaylistDropdown, setShowPlaylistDropdown] = useState(false);
//   const [showNewPlaylistInput, setShowNewPlaylistInput] = useState(false);
//   const [newPlaylistName, setNewPlaylistName] = useState("");
//   const [confirmation, setConfirmation] = useState("");

//   // 👤 Fetch current logged-in user
//   useEffect(() => {
//     const fetchMe = async () => {
//       try {
//         const res = await axiosInstance.get("/users/getcurrentuser");
//         setCurrentUserId(res.data.data._id);
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

//   // 🔔 Subscribe logic
//   useEffect(() => {
//     if (!video?.owner?._id || !currentUserId) return;
//     const fetchSubscriptionInfo = async () => {
//       try {
//         const res = await axiosInstance.get(`/subscriptions/c/${video.owner._id}`);
//         const subs = res.data.data || [];
//         const subscribed = subs.some((sub) => sub.subscriber._id === currentUserId);
//         setIsSubscribed(subscribed);
//         setSubscriberCount(subs.length);
//       } catch (err) {
//         console.error("❌ Error fetching subscription info:", err);
//       }
//     };
//     fetchSubscriptionInfo();
//   }, [video, currentUserId]);

//   const handleToggleSub = async () => {
//     if (!video?.owner?._id) return;
//     setLoadingSub(true);
//     try {
//       await axiosInstance.post(`/subscriptions/toggle/${video.owner._id}`);
//       setIsSubscribed(!isSubscribed);
//       setSubscriberCount((prev) => (isSubscribed ? prev - 1 : prev + 1));
//     } catch (err) {
//       console.error("❌ Error toggling subscription:", err);
//     } finally {
//       setLoadingSub(false);
//     }
//   };

//   // 💬 Comments
//   useEffect(() => {
//     if (!videoId) return;
//     const fetchComments = async () => {
//       try {
//         const res = await axiosInstance.get(`/comments/${videoId}`);
//         setComments(res.data.data || []);
//       } catch (err) {
//         console.error("❌ Error fetching comments:", err);
//       }
//     };
//     fetchComments();
//   }, [videoId]);

//   const handleAddComment = async () => {
//     if (!newComment) return alert("Comment cannot be empty");
//     try {
//       const res = await axiosInstance.post(`/comments/${videoId}`, { comment: newComment });
//       setComments((prev) => [res.data.data, ...prev]);
//       setNewComment("");
//     } catch (err) {
//       console.error("❌ Error adding comment:", err);
//     }
//   };

//   const handleEditClick = (comment) => {
//     setEditingCommentId(comment._id);
//     setEditText(comment.content);
//   };

//   const handleUpdateComment = async (id) => {
//     try {
//       const res = await axiosInstance.patch(`/comments/${id}`, { updatComment: editText });
//       setComments((prev) => prev.map((c) => (c._id === id ? res.data.data : c)));
//       setEditingCommentId(null);
//       setEditText("");
//     } catch (err) {
//       console.error("❌ Error updating comment:", err);
//     }
//   };

//   const handleDeleteComment = async (id) => {
//     try {
//       await axiosInstance.delete(`/comments/${id}`);
//       setComments((prev) => prev.filter((c) => c._id !== id));
//     } catch (err) {
//       console.error("❌ Error deleting comment:", err);
//     }
//   };

//   // ========== Playlist functionality ==========
//   const fetchPlaylists = async () => {
//     if (!currentUserId) return;
//     try {
//       const res = await getAllPlaylists(currentUserId);
//       const pls = res.data || [];
//       setPlaylists(pls);

//       const initial = {};
//       pls.forEach((pl) => (initial[pl._id] = false));
//       setSelectedPlaylists(initial);
//     } catch (err) {
//       console.error("Error fetching playlists:", err);
//     }
//   };

//   const handleTogglePlaylist = (plId) => {
//     setSelectedPlaylists((prev) => ({ ...prev, [plId]: !prev[plId] }));
//   };

//   const handleCreatePlaylist = async () => {
//     if (!newPlaylistName.trim()) return;
//     try {
//       const res = await createPlaylist(currentUserId, newPlaylistName);
//       const newPl = res.data;
//       setPlaylists((prev) => [...prev, newPl]);
//       setSelectedPlaylists((prev) => ({ ...prev, [newPl._id]: true }));
//       setNewPlaylistName("");
//       setShowNewPlaylistInput(false);
//     } catch (err) {
//       console.error("Error creating playlist:", err);
//     }
//   };

//   const handleSaveToPlaylists = async () => {
//     const selectedIds = Object.keys(selectedPlaylists).filter((id) => selectedPlaylists[id]);
//     if (selectedIds.length === 0) return alert("Select at least one playlist");

//     try {
//       for (let plId of selectedIds) {
//         await addVideoToPlaylist(videoId, plId);
//       }
//       setConfirmation(`Video saved to ${selectedIds.length} playlist(s) successfully!`);
//       setShowPlaylistDropdown(false);
//     } catch (err) {
//       console.error("Error saving video to playlists:", err);
//     }
//   };

//   const handleOpenPlaylistDropdown = () => {
//     fetchPlaylists();
//     setShowPlaylistDropdown(true);
//     setConfirmation("");
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-4">
//       {/* Video */}
//       {video ? (
//         <video src={video.videoUrl || video.videofile} controls autoPlay className="w-full rounded-lg shadow-md" />
//       ) : <p className="text-center">Loading video...</p>}

//       {/* Video Info */}
//       {video && (
//         <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:gap-4">
//           <div className="flex items-center gap-3">
//             <button
//               onClick={handleToggleSub}
//               disabled={loadingSub}
//               className={`px-4 py-2 rounded-lg text-white ${isSubscribed ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"}`}
//             >
//               {loadingSub ? "Processing..." : isSubscribed ? "Unsubscribe" : "Subscribe"}
//             </button>

//             {/* Playlist Dropdown */}
//             <div className="relative">
//               <button
//                 onClick={handleOpenPlaylistDropdown}
//                 className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
//               >
//                 Save to Playlist
//               </button>

//               {showPlaylistDropdown && (
//                 <div className="absolute top-full left-0 mt-2 w-64 bg-white border rounded shadow-lg p-3 z-10">
//                   {playlists.map((pl) => (
//                     <div key={pl._id} className="flex items-center gap-2 mb-1">
//                       <input
//                         type="checkbox"
//                         checked={selectedPlaylists[pl._id] || false}
//                         onChange={() => handleTogglePlaylist(pl._id)}
//                       />
//                       <span>{pl.name}</span>
//                     </div>
//                   ))}

//                   {showNewPlaylistInput ? (
//                     <div className="flex gap-2 mt-2">
//                       <input
//                         type="text"
//                         placeholder="New playlist name"
//                         value={newPlaylistName}
//                         onChange={(e) => setNewPlaylistName(e.target.value)}
//                         className="border rounded px-2 py-1 flex-1"
//                       />
//                       <button onClick={handleCreatePlaylist} className="bg-blue-600 text-white px-2 py-1 rounded">
//                         Create
//                       </button>
//                     </div>
//                   ) : (
//                     <button onClick={() => setShowNewPlaylistInput(true)} className="mt-2 text-green-600 flex items-center gap-1 hover:text-green-800">
//                       + New Playlist
//                     </button>
//                   )}

//                   <button onClick={handleSaveToPlaylists} className="mt-2 w-full bg-green-600 text-white px-3 py-1 rounded">
//                     Save
//                   </button>

//                   {confirmation && <p className="text-sm text-green-700 mt-2">{confirmation}</p>}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Comments Section */}
//       <div className="mt-6">
//         <h3 className="text-lg font-semibold mb-2">Add Comment</h3>
//         <textarea
//           className="w-full border rounded-lg p-2"
//           value={newComment}
//           onChange={(e) => setNewComment(e.target.value)}
//           placeholder="Write your comment..."
//         />
//         <button onClick={handleAddComment} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg">
//           Submit
//         </button>
//       </div>

//       <div className="mt-6">
//         <h3 className="text-lg font-semibold mb-2">Comments</h3>
//         {comments.length === 0 ? <p className="text-gray-500">No comments yet.</p> : comments.map((c) => (
//           <div key={c._id} className="border-b py-2 flex flex-col gap-1">
//             {editingCommentId === c._id ? (
//               <>
//                 <textarea className="w-full border rounded-lg p-2" value={editText} onChange={(e) => setEditText(e.target.value)} />
//                 <div className="flex gap-2 mt-1">
//                   <button onClick={() => handleUpdateComment(c._id)} className="px-3 py-1 bg-green-600 text-white rounded">Save</button>
//                   <button onClick={() => setEditingCommentId(null)} className="px-3 py-1 bg-gray-400 text-white rounded">Cancel</button>
//                 </div>
//               </>
//             ) : (
//               <>
//                 <p>{c.content}</p>
//                 <small className="text-gray-500">By: {c.owner?.username} ({c.owner?._id})</small>
//               </>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default CommentSection;












// // show if the video is already in the playlist
// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axiosInstance from "../utils/axiosInstance";
// import { getAllPlaylists, addVideoToPlaylist, createPlaylist } from "../api/playlistApi";

// const CommentSection = () => {
//   const { videoId } = useParams();
//   const [video, setVideo] = useState(null);
//   const [comments, setComments] = useState([]);
//   const [newComment, setNewComment] = useState("");
//   const [editingCommentId, setEditingCommentId] = useState(null);
//   const [editText, setEditText] = useState("");
//   const [currentUserId, setCurrentUserId] = useState(null);

//   const [isSubscribed, setIsSubscribed] = useState(false);
//   const [loadingSub, setLoadingSub] = useState(false);
//   const [subscriberCount, setSubscriberCount] = useState(0);

//   // ========== Playlist state ==========
//   const [playlists, setPlaylists] = useState([]);
//   const [selectedPlaylists, setSelectedPlaylists] = useState({});
//   const [savedPlaylists, setSavedPlaylists] = useState({});
//   const [showPlaylistDropdown, setShowPlaylistDropdown] = useState(false);
//   const [showNewPlaylistInput, setShowNewPlaylistInput] = useState(false);
//   const [newPlaylistName, setNewPlaylistName] = useState("");
//   const [confirmation, setConfirmation] = useState("");

//   // 👤 Fetch current logged-in user
//   useEffect(() => {
//     const fetchMe = async () => {
//       try {
//         const res = await axiosInstance.get("/users/getcurrentuser");
//         setCurrentUserId(res.data.data._id);
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

//   // 🔔 Subscribe logic
//   useEffect(() => {
//     if (!video?.owner?._id || !currentUserId) return;
//     const fetchSubscriptionInfo = async () => {
//       try {
//         const res = await axiosInstance.get(`/subscriptions/c/${video.owner._id}`);
//         const subs = res.data.data || [];
//         const subscribed = subs.some((sub) => sub.subscriber._id === currentUserId);
//         setIsSubscribed(subscribed);
//         setSubscriberCount(subs.length);
//       } catch (err) {
//         console.error("❌ Error fetching subscription info:", err);
//       }
//     };
//     fetchSubscriptionInfo();
//   }, [video, currentUserId]);

//   const handleToggleSub = async () => {
//     if (!video?.owner?._id) return;
//     setLoadingSub(true);
//     try {
//       await axiosInstance.post(`/subscriptions/toggle/${video.owner._id}`);
//       setIsSubscribed(!isSubscribed);
//       setSubscriberCount((prev) => (isSubscribed ? prev - 1 : prev + 1));
//     } catch (err) {
//       console.error("❌ Error toggling subscription:", err);
//     } finally {
//       setLoadingSub(false);
//     }
//   };

//   // 💬 Comments
//   useEffect(() => {
//     if (!videoId) return;
//     const fetchComments = async () => {
//       try {
//         const res = await axiosInstance.get(`/comments/${videoId}`);
//         setComments(res.data.data || []);
//       } catch (err) {
//         console.error("❌ Error fetching comments:", err);
//       }
//     };
//     fetchComments();
//   }, [videoId]);

//   const handleAddComment = async () => {
//     if (!newComment) return alert("Comment cannot be empty");
//     try {
//       const res = await axiosInstance.post(`/comments/${videoId}`, { comment: newComment });
//       setComments((prev) => [res.data.data, ...prev]);
//       setNewComment("");
//     } catch (err) {
//       console.error("❌ Error adding comment:", err);
//     }
//   };

//   const handleEditClick = (comment) => {
//     setEditingCommentId(comment._id);
//     setEditText(comment.content);
//   };

//   const handleUpdateComment = async (id) => {
//     try {
//       const res = await axiosInstance.patch(`/comments/${id}`, { updatComment: editText });
//       setComments((prev) => prev.map((c) => (c._id === id ? res.data.data : c)));
//       setEditingCommentId(null);
//       setEditText("");
//     } catch (err) {
//       console.error("❌ Error updating comment:", err);
//     }
//   };

//   const handleDeleteComment = async (id) => {
//     try {
//       await axiosInstance.delete(`/comments/${id}`);
//       setComments((prev) => prev.filter((c) => c._id !== id));
//     } catch (err) {
//       console.error("❌ Error deleting comment:", err);
//     }
//   };

//   // ========== Playlist functionality ==========
//   const fetchPlaylists = async () => {
//     if (!currentUserId) return;
//     try {
//       const res = await getAllPlaylists(currentUserId);
//       const pls = res.data || [];
//       setPlaylists(pls);

//       const initialSelected = {};
//       const initialSaved = {};
//       pls.forEach((pl) => {
//         initialSelected[pl._id] = false;
//         initialSaved[pl._id] = video?.videos?.includes(pl._id) || false; // saved check
//       });
//       setSelectedPlaylists(initialSelected);
//       setSavedPlaylists(initialSaved);
//     } catch (err) {
//       console.error("Error fetching playlists:", err);
//     }
//   };

//   const handleTogglePlaylist = (plId) => {
//     setSelectedPlaylists((prev) => ({ ...prev, [plId]: !prev[plId] }));
//   };


// const handleCreatePlaylist = async () => {
//   if (!newPlaylistName.trim()) return;
//   try {
//     const res = await createPlaylist(currentUserId, newPlaylistName);
//     const newPl = res.data.data;  // ✅ fix: extract actual playlist object
//     setPlaylists((prev) => [...prev, newPl]);
//     setSelectedPlaylists((prev) => ({ ...prev, [newPl._id]: true }));
//     setSavedPlaylists((prev) => ({ ...prev, [newPl._id]: false }));
//     setNewPlaylistName("");
//     setShowNewPlaylistInput(false);
//   } catch (err) {
//     console.error("Error creating playlist:", err);
//   }
// };


//   const handleSaveToPlaylists = async () => {
//     const selectedIds = Object.keys(selectedPlaylists).filter(
//       (id) => selectedPlaylists[id] && !savedPlaylists[id]
//     );
//     if (selectedIds.length === 0) {
//       setConfirmation("Video already in selected playlist(s) ✅");
//       return;
//     }

//     try {
//       for (let plId of selectedIds) {
//         await addVideoToPlaylist(videoId, plId);
//       }

//       const updatedSaved = { ...savedPlaylists };
//       selectedIds.forEach((id) => (updatedSaved[id] = true));
//       setSavedPlaylists(updatedSaved);

//       setConfirmation(`Video saved to ${selectedIds.length} playlist(s) successfully! ✅`);
//       setShowPlaylistDropdown(false);

//     } catch (err) {
//       const backendMessage = err?.response?.data?.message || err.message;

//       if (backendMessage === "Video already in playlist") {
//         const updatedSaved = { ...savedPlaylists };
//         selectedIds.forEach((id) => (updatedSaved[id] = true));
//         setSavedPlaylists(updatedSaved);
//         setConfirmation("❌ Error saving video to playlist");
//         setShowPlaylistDropdown(false);
//       } else {
//         console.error("Error saving video to playlists:", err);
//         setConfirmation("Video is already in this playlist ✅");
//       }
//     }
//   };

//   const handleOpenPlaylistDropdown = () => {
//     fetchPlaylists();
//     setShowPlaylistDropdown(true);
//     setConfirmation("");
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-4">
//       {/* Video */}
//       {video ? (
//         <video src={video.videoUrl || video.videofile} controls autoPlay className="w-full rounded-lg shadow-md" />
//       ) : <p className="text-center">Loading video...</p>}

//       {/* Video Info */}
//       {video && (
//         <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:gap-4">
//           <div className="flex items-center gap-3">
//             <button
//               onClick={handleToggleSub}
//               disabled={loadingSub}
//               className={`px-4 py-2 rounded-lg text-white ${isSubscribed ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"}`}
//             >
//               {loadingSub ? "Processing..." : isSubscribed ? "Unsubscribe" : "Subscribe"}
//             </button>

//             {/* Playlist Dropdown */}
//             <div className="relative">
//               <button
//                 onClick={handleOpenPlaylistDropdown}
//                 className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
//               >
//                 Save to Playlist
//               </button>

//               {showPlaylistDropdown && (
//                 <div className="absolute top-full left-0 mt-2 w-64 bg-white border rounded shadow-lg p-3 z-10">
//                   {playlists.map((pl) => (
//                     <div key={pl._id} className="flex items-center gap-2 mb-1">
//                       <input
//                         type="checkbox"
//                         checked={selectedPlaylists[pl._id] || false}
//                         disabled={savedPlaylists[pl._id]}
//                         onChange={() => handleTogglePlaylist(pl._id)}
//                       />
//                       <span>{pl.name} {savedPlaylists[pl._id] && "✅"}</span>
//                     </div>
//                   ))}

//                   {showNewPlaylistInput ? (
//                     <div className="flex gap-2 mt-2">
//                       <input
//                         type="text"
//                         placeholder="New playlist name"
//                         value={newPlaylistName}
//                         onChange={(e) => setNewPlaylistName(e.target.value)}
//                         className="border rounded px-2 py-1 flex-1"
//                       />
//                       <button onClick={handleCreatePlaylist} className="bg-blue-600 text-white px-2 py-1 rounded">
//                         Create
//                       </button>
//                     </div>
//                   ) : (
//                     <button onClick={() => setShowNewPlaylistInput(true)} className="mt-2 text-green-600 flex items-center gap-1 hover:text-green-800">
//                       + New Playlist
//                     </button>
//                   )}

//                   <button onClick={handleSaveToPlaylists} className="mt-2 w-full bg-green-600 text-white px-3 py-1 rounded">
//                     Save
//                   </button>

//                   {confirmation && <p className="text-sm text-green-700 mt-2">{confirmation}</p>}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Comments Section */}
//       <div className="mt-6">
//         <h3 className="text-lg font-semibold mb-2">Add Comment</h3>
//         <textarea
//           className="w-full border rounded-lg p-2"
//           value={newComment}
//           onChange={(e) => setNewComment(e.target.value)}
//           placeholder="Write your comment..."
//         />
//         <button onClick={handleAddComment} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg">
//           Submit
//         </button>
//       </div>

//       <div className="mt-6">
//         <h3 className="text-lg font-semibold mb-2">Comments</h3>
//         {comments.length === 0 ? <p className="text-gray-500">No comments yet.</p> : comments.map((c) => (
//           <div key={c._id} className="border-b py-2 flex flex-col gap-1">
//             {editingCommentId === c._id ? (
//               <>
//                 <textarea className="w-full border rounded-lg p-2" value={editText} onChange={(e) => setEditText(e.target.value)} />
//                 <div className="flex gap-2 mt-1">
//                   <button onClick={() => handleUpdateComment(c._id)} className="px-3 py-1 bg-green-600 text-white rounded">Save</button>
//                   <button onClick={() => setEditingCommentId(null)} className="px-3 py-1 bg-gray-400 text-white rounded">Cancel</button>
//                 </div>
//               </>
//             ) : (
//               <>
//                 <p>{c.content}</p>
//                 <small className="text-gray-500">By: {c.owner?.username}</small>
//               </>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default CommentSection;














// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axiosInstance from "../utils/axiosInstance";
// import {
//   getAllPlaylists,
//   addVideoToPlaylist,
//   createPlaylist,
// } from "../api/playlistApi";

// const CommentSection = () => {
//   const { videoId } = useParams();
//   const [video, setVideo] = useState(null);
//   const [comments, setComments] = useState([]);
//   const [newComment, setNewComment] = useState("");
//   const [editingCommentId, setEditingCommentId] = useState(null);
//   const [editText, setEditText] = useState("");
//   const [currentUserId, setCurrentUserId] = useState(null);

//   const [isSubscribed, setIsSubscribed] = useState(false);
//   const [loadingSub, setLoadingSub] = useState(false);
//   const [subscriberCount, setSubscriberCount] = useState(0);

//   // ========== Playlist state ==========
//   const [playlists, setPlaylists] = useState([]);
//   const [selectedPlaylists, setSelectedPlaylists] = useState({});
//   const [savedPlaylists, setSavedPlaylists] = useState({});
//   const [showPlaylistDropdown, setShowPlaylistDropdown] = useState(false);
//   const [showNewPlaylistInput, setShowNewPlaylistInput] = useState(false);
//   const [newPlaylistName, setNewPlaylistName] = useState("");
//   const [confirmation, setConfirmation] = useState("");

//   // 👤 Fetch current logged-in user
//   useEffect(() => {
//     const fetchMe = async () => {
//       try {
//         const res = await axiosInstance.get("/users/getcurrentuser");
//         setCurrentUserId(res.data.data._id);
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

//   // 🔔 Subscribe logic
//   useEffect(() => {
//     if (!video?.owner?._id || !currentUserId) return;
//     const fetchSubscriptionInfo = async () => {
//       try {
//         const res = await axiosInstance.get(
//           `/subscriptions/c/${video.owner._id}`
//         );
//         const subs = res.data.data || [];
//         const subscribed = subs.some(
//           (sub) => sub.subscriber._id === currentUserId
//         );
//         setIsSubscribed(subscribed);
//         setSubscriberCount(subs.length);
//       } catch (err) {
//         console.error("❌ Error fetching subscription info:", err);
//       }
//     };
//     fetchSubscriptionInfo();
//   }, [video, currentUserId]);

//   const handleToggleSub = async () => {
//     if (!video?.owner?._id) return;
//     setLoadingSub(true);
//     try {
//       await axiosInstance.post(`/subscriptions/toggle/${video.owner._id}`);
//       setIsSubscribed(!isSubscribed);
//       setSubscriberCount((prev) => (isSubscribed ? prev - 1 : prev + 1));
//     } catch (err) {
//       console.error("❌ Error toggling subscription:", err);
//     } finally {
//       setLoadingSub(false);
//     }
//   };

//   // 💬 Comments
//   useEffect(() => {
//     if (!videoId) return;
//     const fetchComments = async () => {
//       try {
//         const res = await axiosInstance.get(`/comments/${videoId}`);
//         setComments(res.data.data || []);
//       } catch (err) {
//         console.error("❌ Error fetching comments:", err);
//       }
//     };
//     fetchComments();
//   }, [videoId]);

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

//   const handleEditClick = (comment) => {
//     setEditingCommentId(comment._id);
//     setEditText(comment.content);
//   };

//   const handleUpdateComment = async (id) => {
//     try {
//       const res = await axiosInstance.patch(`/comments/${id}`, {
//         updatComment: editText,
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

//   const handleDeleteComment = async (id) => {
//     try {
//       await axiosInstance.delete(`/comments/${id}`);
//       setComments((prev) => prev.filter((c) => c._id !== id));
//     } catch (err) {
//       console.error("❌ Error deleting comment:", err);
//     }
//   };

//   // ========== Playlist functionality ==========
//   const fetchPlaylists = async () => {
//     if (!currentUserId) return;
//     try {
//       const res = await getAllPlaylists(currentUserId);
//       const pls = res.data || [];
//       setPlaylists(pls);

//       const initialSelected = {};
//       const initialSaved = {};
//       pls.forEach((pl) => {
//         initialSelected[pl._id] = false;
//         initialSaved[pl._id] = video?.videos?.includes(pl._id) || false; // saved check
//       });
//       setSelectedPlaylists(initialSelected);
//       setSavedPlaylists(initialSaved);
//     } catch (err) {
//       console.error("Error fetching playlists:", err);
//     }
//   };

//   const handleTogglePlaylist = (plId) => {
//     setSelectedPlaylists((prev) => ({ ...prev, [plId]: !prev[plId] }));
//   };

//   const handleCreatePlaylist = async () => {
//     if (!newPlaylistName.trim()) return;
//     try {
//       const res = await createPlaylist(currentUserId, newPlaylistName);
//       const newPl = res.data.data;
//       setPlaylists((prev) => [...prev, newPl]);
//       setSelectedPlaylists((prev) => ({ ...prev, [newPl._id]: true }));
//       setSavedPlaylists((prev) => ({ ...prev, [newPl._id]: false }));
//       setNewPlaylistName("");
//       setShowNewPlaylistInput(false);
//     } catch (err) {
//       console.error("Error creating playlist:", err);
//     }
//   };

//   const handleSaveToPlaylists = async () => {
//     const selectedIds = Object.keys(selectedPlaylists).filter(
//       (id) => selectedPlaylists[id] && !savedPlaylists[id]
//     );
//     if (selectedIds.length === 0) {
//       setConfirmation("Video already in selected playlist(s) ✅");
//       return;
//     }

//     try {
//       for (let plId of selectedIds) {
//         await addVideoToPlaylist(videoId, plId);
//       }

//       const updatedSaved = { ...savedPlaylists };
//       selectedIds.forEach((id) => (updatedSaved[id] = true));
//       setSavedPlaylists(updatedSaved);

//       setConfirmation(
//         `Video saved to ${selectedIds.length} playlist(s) successfully! ✅`
//       );
//       setShowPlaylistDropdown(false);
//     } catch (err) {
//       console.error("Error saving video to playlists:", err);
//       setConfirmation("❌ Error saving video to playlist");
//     }
//   };

//   const handleOpenPlaylistDropdown = () => {
//     fetchPlaylists();
//     setShowPlaylistDropdown(true);
//     setConfirmation("");
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-4">
//       {/* Video */}
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

//       {/* Video Info */}
//       {video && (
//         <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:gap-4">
//           <div className="flex items-center gap-3">
//             <button
//               onClick={handleToggleSub}
//               disabled={loadingSub}
//               className={`px-4 py-2 rounded-lg text-white ${
//                 isSubscribed
//                   ? "bg-red-600 hover:bg-red-700"
//                   : "bg-blue-600 hover:bg-blue-700"
//               }`}
//             >
//               {loadingSub
//                 ? "Processing..."
//                 : isSubscribed
//                 ? "Unsubscribe"
//                 : "Subscribe"}
//             </button>

//             {/* Playlist Dropdown */}
//             <div className="relative">
//               <button
//                 onClick={handleOpenPlaylistDropdown}
//                 className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
//               >
//                 Save to Playlist
//               </button>

//               {showPlaylistDropdown && (
//                 <div className="absolute top-full left-0 mt-2 w-64 bg-white border rounded shadow-lg p-3 z-10">
//                   {playlists.map((pl) => (
//                     <div key={pl._id} className="flex items-center gap-2 mb-1">
//                       <input
//                         type="checkbox"
//                         checked={selectedPlaylists[pl._id] || false}
//                         disabled={savedPlaylists[pl._id]}
//                         onChange={() => handleTogglePlaylist(pl._id)}
//                       />
//                       <span>
//                         {pl.name} {savedPlaylists[pl._id] && "✅"}
//                       </span>
//                     </div>
//                   ))}

//                   {showNewPlaylistInput ? (
//                     <div className="flex gap-2 mt-2">
//                       <input
//                         type="text"
//                         placeholder="New playlist name"
//                         value={newPlaylistName}
//                         onChange={(e) => setNewPlaylistName(e.target.value)}
//                         className="border rounded px-2 py-1 flex-1"
//                       />
//                       <button
//                         onClick={handleCreatePlaylist}
//                         className="bg-blue-600 text-white px-2 py-1 rounded"
//                       >
//                         Create
//                       </button>
//                     </div>
//                   ) : (
//                     <button
//                       onClick={() => setShowNewPlaylistInput(true)}
//                       className="mt-2 text-green-600 flex items-center gap-1 hover:text-green-800"
//                     >
//                       + New Playlist
//                     </button>
//                   )}

//                   <button
//                     onClick={handleSaveToPlaylists}
//                     className="mt-2 w-full bg-green-600 text-white px-3 py-1 rounded"
//                   >
//                     Save
//                   </button>

//                   {confirmation && (
//                     <p className="text-sm text-green-700 mt-2">{confirmation}</p>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Comments Section */}
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

//       {/* Show Comments */}
//       <div className="mt-6">
//         <h3 className="text-lg font-semibold mb-2">Comments</h3>
//         {comments.length === 0 ? (
//           <p className="text-gray-500">No comments yet.</p>
//         ) : (
//           comments.map((c) => (
//             <div key={c._id} className="border-b py-2 flex flex-col gap-1">
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
//                     By: {c.owner?.username}
//                   </small>

//                   {/* ✅ Only show Edit/Delete if owner */}
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







//ok with like but count  not displaying properly

// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axiosInstance from "../utils/axiosInstance";
// import { FaThumbsUp } from "react-icons/fa"; // Thumbs icon
// import {
//   toggleVideoLike,
//   toggleCommentLike,
// } from "../api/likeApi";
// import {
//   getAllPlaylists,
//   addVideoToPlaylist,
//   createPlaylist,
// } from "../api/playlistApi";

// const CommentSection = () => {
//   const { videoId } = useParams();
//   const [video, setVideo] = useState(null);
//   const [comments, setComments] = useState([]);
//   const [newComment, setNewComment] = useState("");
//   const [editingCommentId, setEditingCommentId] = useState(null);
//   const [editText, setEditText] = useState("");
//   const [currentUserId, setCurrentUserId] = useState(null);

//   const [videoLiked, setVideoLiked] = useState(false);
//   const [videoLikes, setVideoLikes] = useState(0);
//   const [views, setViews] = useState(0);

//   const [isSubscribed, setIsSubscribed] = useState(false);
//   const [loadingSub, setLoadingSub] = useState(false);
//   const [subscriberCount, setSubscriberCount] = useState(0);

//   // ========== Playlist state ==========
//   const [playlists, setPlaylists] = useState([]);
//   const [selectedPlaylists, setSelectedPlaylists] = useState({});
//   const [savedPlaylists, setSavedPlaylists] = useState({});
//   const [showPlaylistDropdown, setShowPlaylistDropdown] = useState(false);
//   const [showNewPlaylistInput, setShowNewPlaylistInput] = useState(false);
//   const [newPlaylistName, setNewPlaylistName] = useState("");
//   const [confirmation, setConfirmation] = useState("");

//   // 👤 Fetch current logged-in user
//   useEffect(() => {
//     const fetchMe = async () => {
//       try {
//         const res = await axiosInstance.get("/users/getcurrentuser");
//         setCurrentUserId(res.data.data._id);
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
//         setVideoLiked(res.data.data.isLiked || false);
//         setVideoLikes(res.data.data.likesCount || 0);
//         setViews(res.data.data.views || 0);

//         await axiosInstance.patch(`/videos/views/${videoId}`);
//       } catch (err) {
//         console.error("❌ Error fetching video:", err);
//       }
//     };
//     fetchVideo();
//   }, [videoId]);

//   // 🔔 Subscribe logic
//   useEffect(() => {
//     if (!video?.owner?._id || !currentUserId) return;
//     const fetchSubscriptionInfo = async () => {
//       try {
//         const res = await axiosInstance.get(
//           `/subscriptions/c/${video.owner._id}`
//         );
//         const subs = res.data.data || [];
//         const subscribed = subs.some(
//           (sub) => sub.subscriber._id === currentUserId
//         );
//         setIsSubscribed(subscribed);
//         setSubscriberCount(subs.length);
//       } catch (err) {
//         console.error("❌ Error fetching subscription info:", err);
//       }
//     };
//     fetchSubscriptionInfo();
//   }, [video, currentUserId]);

//   const handleToggleSub = async () => {
//     if (!video?.owner?._id) return;
//     setLoadingSub(true);
//     try {
//       await axiosInstance.post(`/subscriptions/toggle/${video.owner._id}`);
//       setIsSubscribed(!isSubscribed);
//       setSubscriberCount((prev) => (isSubscribed ? prev - 1 : prev + 1));
//     } catch (err) {
//       console.error("❌ Error toggling subscription:", err);
//     } finally {
//       setLoadingSub(false);
//     }
//   };

//   // 💬 Fetch comments
//   useEffect(() => {
//     if (!videoId) return;
//     const fetchComments = async () => {
//       try {
//         const res = await axiosInstance.get(`/comments/${videoId}`);
//         const commentsWithLikes = res.data.data.map((c) => ({
//           ...c,
//           isLiked: c.isLiked || false,
//           likesCount: c.likesCount || 0,
//         }));
//         setComments(commentsWithLikes);
//       } catch (err) {
//         console.error("❌ Error fetching comments:", err);
//       }
//     };
//     fetchComments();
//   }, [videoId]);

//   // ===== Video Like Handler =====
//   const handleVideoLike = async () => {
//   if (!currentUserId) return alert("❌ You must be logged in to like this video.");
  
//   try {
//     await toggleVideoLike(videoId);
//     setVideoLiked(!videoLiked);
//     setVideoLikes(videoLiked ? videoLikes - 1 : videoLikes + 1);
//   } catch (err) {
//     console.error(err);
//   }
// };


//   // ===== Comment Like Handler =====
//   const handleCommentLike = async (commentId) => {
//     setComments((prev) =>
//       prev.map((c) => {
//         if (c._id === commentId) {
//           const liked = !c.isLiked;
//           return {
//             ...c,
//             isLiked: liked,
//             likesCount: liked ? c.likesCount + 1 : c.likesCount - 1,
//           };
//         }
//         return c;
//       })
//     );
//     try {
//       await toggleCommentLike(commentId);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // ===== Comment CRUD =====
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

//   const handleEditClick = (comment) => {
//     setEditingCommentId(comment._id);
//     setEditText(comment.content);
//   };

//   const handleUpdateComment = async (id) => {
//     try {
//       const res = await axiosInstance.patch(`/comments/${id}`, {
//         updatComment: editText,
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

//   const handleDeleteComment = async (id) => {
//     try {
//       await axiosInstance.delete(`/comments/${id}`);
//       setComments((prev) => prev.filter((c) => c._id !== id));
//     } catch (err) {
//       console.error("❌ Error deleting comment:", err);
//     }
//   };

//   // ========== Playlist functionality ==========
//   const fetchPlaylists = async () => {
//     if (!currentUserId) return;
//     try {
//       const res = await getAllPlaylists(currentUserId);
//       const pls = res.data || [];
//       setPlaylists(pls);

//       const initialSelected = {};
//       const initialSaved = {};
//       pls.forEach((pl) => {
//         initialSelected[pl._id] = false;
//         initialSaved[pl._id] = video?.videos?.includes(pl._id) || false;
//       });
//       setSelectedPlaylists(initialSelected);
//       setSavedPlaylists(initialSaved);
//     } catch (err) {
//       console.error("Error fetching playlists:", err);
//     }
//   };

//   const handleTogglePlaylist = (plId) => {
//     setSelectedPlaylists((prev) => ({ ...prev, [plId]: !prev[plId] }));
//   };

//   const handleCreatePlaylist = async () => {
//     if (!newPlaylistName.trim()) return;
//     try {
//       const res = await createPlaylist(currentUserId, newPlaylistName);
//       const newPl = res.data.data;
//       setPlaylists((prev) => [...prev, newPl]);
//       setSelectedPlaylists((prev) => ({ ...prev, [newPl._id]: true }));
//       setSavedPlaylists((prev) => ({ ...prev, [newPl._id]: false }));
//       setNewPlaylistName("");
//       setShowNewPlaylistInput(false);
//     } catch (err) {
//       console.error("Error creating playlist:", err);
//     }
//   };

//   const handleSaveToPlaylists = async () => {
//     const selectedIds = Object.keys(selectedPlaylists).filter(
//       (id) => selectedPlaylists[id] && !savedPlaylists[id]
//     );
//     if (selectedIds.length === 0) {
//       setConfirmation("Video already in selected playlist(s) ✅");
//       return;
//     }

//     try {
//       for (let plId of selectedIds) {
//         await addVideoToPlaylist(videoId, plId);
//       }

//       const updatedSaved = { ...savedPlaylists };
//       selectedIds.forEach((id) => (updatedSaved[id] = true));
//       setSavedPlaylists(updatedSaved);

//       setConfirmation(
//         `Video saved to ${selectedIds.length} playlist(s) successfully! ✅`
//       );
//       setShowPlaylistDropdown(false);
//     } catch (err) {
//       console.error("Error saving video to playlists:", err);
//       setConfirmation("❌ Error saving video to playlist");
//     }
//   };

//   const handleOpenPlaylistDropdown = () => {
//     fetchPlaylists();
//     setShowPlaylistDropdown(true);
//     setConfirmation("");
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-4">
//       {/* Video */}
//       {video ? (
//         <div className="relative">
//           <video
//             src={video.videoUrl || video.videofile}
//             controls
//             className="w-full rounded-lg shadow-md"
//           />
//           <div className="flex items-center gap-4 mt-2">
//             <button
//               onClick={handleVideoLike}
//               className={`flex items-center gap-1 px-3 py-1 rounded-lg text-white ${
//                 videoLiked ? "bg-red-600" : "bg-blue-600"
//               }`}
//             >
//               <FaThumbsUp />
//               {videoLikes}
//             </button>
//             <span className="text-gray-500">{views} views</span>
//           </div>
//         </div>
//       ) : (
//         <p className="text-center">Loading video...</p>
//       )}

//       {/* Video Info */}
//       {video && (
//         <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:gap-4">
//           <div className="flex items-center gap-3">
//             <button
//               onClick={handleToggleSub}
//               disabled={loadingSub}
//               className={`px-4 py-2 rounded-lg text-white ${
//                 isSubscribed
//                   ? "bg-red-600 hover:bg-red-700"
//                   : "bg-blue-600 hover:bg-blue-700"
//               }`}
//             >
//               {loadingSub
//                 ? "Processing..."
//                 : isSubscribed
//                 ? "Unsubscribe"
//                 : "Subscribe"}
//             </button>

//             {/* Playlist Dropdown */}
//             <div className="relative">
//               <button
//                 onClick={handleOpenPlaylistDropdown}
//                 className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
//               >
//                 Save to Playlist
//               </button>

//               {showPlaylistDropdown && (
//                 <div className="absolute top-full left-0 mt-2 w-64 bg-white border rounded shadow-lg p-3 z-10">
//                   {playlists.map((pl) => (
//                     <div key={pl._id} className="flex items-center gap-2 mb-1">
//                       <input
//                         type="checkbox"
//                         checked={selectedPlaylists[pl._id] || false}
//                         disabled={savedPlaylists[pl._id]}
//                         onChange={() => handleTogglePlaylist(pl._id)}
//                       />
//                       <span>
//                         {pl.name} {savedPlaylists[pl._id] && "✅"}
//                       </span>
//                     </div>
//                   ))}

//                   {showNewPlaylistInput ? (
//                     <div className="flex gap-2 mt-2">
//                       <input
//                         type="text"
//                         placeholder="New playlist name"
//                         value={newPlaylistName}
//                         onChange={(e) => setNewPlaylistName(e.target.value)}
//                         className="border rounded px-2 py-1 flex-1"
//                       />
//                       <button
//                         onClick={handleCreatePlaylist}
//                         className="bg-blue-600 text-white px-2 py-1 rounded"
//                       >
//                         Create
//                       </button>
//                     </div>
//                   ) : (
//                     <button
//                       onClick={() => setShowNewPlaylistInput(true)}
//                       className="mt-2 text-green-600 flex items-center gap-1 hover:text-green-800"
//                     >
//                       + New Playlist
//                     </button>
//                   )}

//                   <button
//                     onClick={handleSaveToPlaylists}
//                     className="mt-2 w-full bg-green-600 text-white px-3 py-1 rounded"
//                   >
//                     Save
//                   </button>

//                   {confirmation && (
//                     <p className="text-sm text-green-700 mt-2">{confirmation}</p>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Add Comment */}
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

//       {/* Show Comments */}
//       <div className="mt-6">
//         <h3 className="text-lg font-semibold mb-2">Comments</h3>
//         {comments.length === 0 ? (
//           <p className="text-gray-500">No comments yet.</p>
//         ) : (
//           comments.map((c) => (
//             <div key={c._id} className="border-b py-2 flex flex-col gap-1">
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
//                     By: {c.owner?.username}
//                   </small>

//                   <div className="flex items-center gap-3 mt-1">
//                     <button
//                       onClick={() => handleCommentLike(c._id)}
//                       className={`flex items-center gap-1 px-2 py-1 rounded text-white ${
//                         c.isLiked ? "bg-red-600" : "bg-blue-600"
//                       }`}
//                     >
//                       <FaThumbsUp />
//                       {c.likesCount}
//                     </button>
//                   </div>

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







// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axiosInstance from "../utils/axiosInstance";
// import { FaThumbsUp } from "react-icons/fa";
// import { toggleVideoLike, toggleCommentLike } from "../api/likeApi";
// import { getAllPlaylists, addVideoToPlaylist, createPlaylist } from "../api/playlistApi";

// const CommentSection = () => {
//   const { videoId } = useParams();
//   const [video, setVideo] = useState(null);
//   const [comments, setComments] = useState([]);
//   const [newComment, setNewComment] = useState("");
//   const [editingCommentId, setEditingCommentId] = useState(null);
//   const [editText, setEditText] = useState("");
//   const [currentUserId, setCurrentUserId] = useState(null);

//   const [videoLiked, setVideoLiked] = useState(false);
//   const [videoLikes, setVideoLikes] = useState(0);
//   const [views, setViews] = useState(0);

//   const [isSubscribed, setIsSubscribed] = useState(false);
//   const [loadingSub, setLoadingSub] = useState(false);
//   const [subscriberCount, setSubscriberCount] = useState(0);

//   // Playlist state
//   const [playlists, setPlaylists] = useState([]);
//   const [selectedPlaylists, setSelectedPlaylists] = useState({});
//   const [savedPlaylists, setSavedPlaylists] = useState({});
//   const [showPlaylistDropdown, setShowPlaylistDropdown] = useState(false);
//   const [showNewPlaylistInput, setShowNewPlaylistInput] = useState(false);
//   const [newPlaylistName, setNewPlaylistName] = useState("");
//   const [confirmation, setConfirmation] = useState("");

//   // Fetch current logged-in user
//   useEffect(() => {
//     const fetchMe = async () => {
//       try {
//         const res = await axiosInstance.get("/users/getcurrentuser");
//         setCurrentUserId(res.data.data._id);
//       } catch (err) {
//         console.error("❌ Error fetching user:", err);
//       }
//     };
//     fetchMe();
//   }, []);

//   // Fetch video + increment views
//   useEffect(() => {
//     if (!videoId) return;
//     const fetchVideo = async () => {
//       try {
//         const res = await axiosInstance.get(`/videos/${videoId}`);
//         setVideo(res.data.data);
//         setViews(res.data.data.views || 0);

//         // Increment views
//         await axiosInstance.patch(`/videos/views/${videoId}`);

//         // Fetch video likes separately if needed
//         // Assuming backend has endpoint to get likes count for video
//         const likeRes = await axiosInstance.get(`/likes/count/v/${videoId}`);
//         setVideoLikes(likeRes.data.likes || 0);

//         // Check if current user liked this video
//         const likedRes = await axiosInstance.get(`/likes/status/v/${videoId}`);
//         setVideoLiked(likedRes.data.isLiked || false);
//       } catch (err) {
//         console.error("❌ Error fetching video:", err);
//       }
//     };
//     fetchVideo();
//   }, [videoId]);

//   // Subscribe logic
//   useEffect(() => {
//     if (!video?.owner?._id || !currentUserId) return;
//     const fetchSubscriptionInfo = async () => {
//       try {
//         const res = await axiosInstance.get(`/subscriptions/c/${video.owner._id}`);
//         const subs = res.data.data || [];
//         const subscribed = subs.some((sub) => sub.subscriber._id === currentUserId);
//         setIsSubscribed(subscribed);
//         setSubscriberCount(subs.length);
//       } catch (err) {
//         console.error("❌ Error fetching subscription info:", err);
//       }
//     };
//     fetchSubscriptionInfo();
//   }, [video, currentUserId]);

//   const handleToggleSub = async () => {
//     if (!video?.owner?._id) return;
//     setLoadingSub(true);
//     try {
//       await axiosInstance.post(`/subscriptions/toggle/${video.owner._id}`);
//       setIsSubscribed(!isSubscribed);
//       setSubscriberCount((prev) => (isSubscribed ? prev - 1 : prev + 1));
//     } catch (err) {
//       console.error("❌ Error toggling subscription:", err);
//     } finally {
//       setLoadingSub(false);
//     }
//   };

//   // Fetch comments
//   useEffect(() => {
//     if (!videoId) return;
//     const fetchComments = async () => {
//       try {
//         const res = await axiosInstance.get(`/comments/${videoId}`);
//         const commentsData = res.data.data;

//         // Fetch likes count for each comment
//         const commentsWithLikes = await Promise.all(
//           commentsData.map(async (c) => {
//             try {
//               const likeRes = await axiosInstance.get(`/likes/count/c/${c._id}`);
//               const likedRes = await axiosInstance.get(`/likes/status/c/${c._id}`);
//               return {
//                 ...c,
//                 likesCount: likeRes.data.likes || 0,
//                 isLiked: likedRes.data.isLiked || false,
//               };
//             } catch {
//               return { ...c, likesCount: 0, isLiked: false };
//             }
//           })
//         );

//         setComments(commentsWithLikes);
//       } catch (err) {
//         console.error("❌ Error fetching comments:", err);
//       }
//     };
//     fetchComments();
//   }, [videoId]);

//   // Video like handler
//   const handleVideoLike = async () => {
//     if (!currentUserId) return alert("❌ You must be logged in to like this video.");
//     try {
//       await toggleVideoLike(videoId);
//       setVideoLiked(!videoLiked);
//       setVideoLikes(videoLiked ? videoLikes - 1 : videoLikes + 1);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // Comment like handler
//   const handleCommentLike = async (commentId) => {
//     setComments((prev) =>
//       prev.map((c) => {
//         if (c._id === commentId) {
//           const liked = !c.isLiked;
//           return {
//             ...c,
//             isLiked: liked,
//             likesCount: liked ? c.likesCount + 1 : c.likesCount - 1,
//           };
//         }
//         return c;
//       })
//     );
//     try {
//       await toggleCommentLike(commentId);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // Comment CRUD
//   const handleAddComment = async () => {
//     if (!newComment) return alert("Comment cannot be empty");
//     try {
//       const res = await axiosInstance.post(`/comments/${videoId}`, { comment: newComment });
//       setComments((prev) => [res.data.data, ...prev]);
//       setNewComment("");
//     } catch (err) {
//       console.error("❌ Error adding comment:", err);
//     }
//   };

//   const handleEditClick = (comment) => {
//     setEditingCommentId(comment._id);
//     setEditText(comment.content);
//   };

//   const handleUpdateComment = async (id) => {
//     try {
//       const res = await axiosInstance.patch(`/comments/${id}`, { updatComment: editText });
//       setComments((prev) => prev.map((c) => (c._id === id ? res.data.data : c)));
//       setEditingCommentId(null);
//       setEditText("");
//     } catch (err) {
//       console.error("❌ Error updating comment:", err);
//     }
//   };

//   const handleDeleteComment = async (id) => {
//     try {
//       await axiosInstance.delete(`/comments/${id}`);
//       setComments((prev) => prev.filter((c) => c._id !== id));
//     } catch (err) {
//       console.error("❌ Error deleting comment:", err);
//     }
//   };

//   // Playlist functionality (unchanged)
//   const fetchPlaylists = async () => {
//     if (!currentUserId) return;
//     try {
//       const res = await getAllPlaylists(currentUserId);
//       const pls = res.data || [];
//       setPlaylists(pls);

//       const initialSelected = {};
//       const initialSaved = {};
//       pls.forEach((pl) => {
//         initialSelected[pl._id] = false;
//         initialSaved[pl._id] = video?.videos?.includes(pl._id) || false;
//       });
//       setSelectedPlaylists(initialSelected);
//       setSavedPlaylists(initialSaved);
//     } catch (err) {
//       console.error("Error fetching playlists:", err);
//     }
//   };

//   const handleTogglePlaylist = (plId) => {
//     setSelectedPlaylists((prev) => ({ ...prev, [plId]: !prev[plId] }));
//   };

//   const handleCreatePlaylist = async () => {
//     if (!newPlaylistName.trim()) return;
//     try {
//       const res = await createPlaylist(currentUserId, newPlaylistName);
//       const newPl = res.data.data;
//       setPlaylists((prev) => [...prev, newPl]);
//       setSelectedPlaylists((prev) => ({ ...prev, [newPl._id]: true }));
//       setSavedPlaylists((prev) => ({ ...prev, [newPl._id]: false }));
//       setNewPlaylistName("");
//       setShowNewPlaylistInput(false);
//     } catch (err) {
//       console.error("Error creating playlist:", err);
//     }
//   };

//   const handleSaveToPlaylists = async () => {
//     const selectedIds = Object.keys(selectedPlaylists).filter(
//       (id) => selectedPlaylists[id] && !savedPlaylists[id]
//     );
//     if (selectedIds.length === 0) {
//       setConfirmation("Video already in selected playlist(s) ✅");
//       return;
//     }

//     try {
//       for (let plId of selectedIds) {
//         await addVideoToPlaylist(videoId, plId);
//       }

//       const updatedSaved = { ...savedPlaylists };
//       selectedIds.forEach((id) => (updatedSaved[id] = true));
//       setSavedPlaylists(updatedSaved);

//       setConfirmation(`Video saved to ${selectedIds.length} playlist(s) successfully! ✅`);
//       setShowPlaylistDropdown(false);
//     } catch (err) {
//       console.error("Error saving video to playlists:", err);
//       setConfirmation("❌ Error saving video to playlist");
//     }
//   };

//   const handleOpenPlaylistDropdown = () => {
//     fetchPlaylists();
//     setShowPlaylistDropdown(true);
//     setConfirmation("");
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-4">
//       {/* Video */}
//       {video ? (
//         <div className="relative">
//           <video src={video.videoUrl || video.videofile} controls className="w-full rounded-lg shadow-md" />
//           <div className="flex items-center gap-4 mt-2">
//             <button
//               onClick={handleVideoLike}
//               className={`flex items-center gap-1 px-3 py-1 rounded-lg text-white ${
//                 videoLiked ? "bg-red-600" : "bg-blue-600"
//               }`}
//             >
//               <FaThumbsUp />
//               {videoLikes}
//             </button>
//             <span className="text-gray-500">{views} views</span>
//           </div>
//         </div>
//       ) : (
//         <p className="text-center">Loading video...</p>
//       )}

//       {/* Video Info & Playlist */}
//       {video && (
//         <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:gap-4">
//           <div className="flex items-center gap-3">
//             <button
//               onClick={handleToggleSub}
//               disabled={loadingSub}
//               className={`px-4 py-2 rounded-lg text-white ${
//                 isSubscribed ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"
//               }`}
//             >
//               {loadingSub ? "Processing..." : isSubscribed ? "Unsubscribe" : "Subscribe"}
//             </button>

//             {/* Playlist Dropdown */}
//             <div className="relative">
//               <button
//                 onClick={handleOpenPlaylistDropdown}
//                 className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
//               >
//                 Save to Playlist
//               </button>

//               {showPlaylistDropdown && (
//                 <div className="absolute top-full left-0 mt-2 w-64 bg-white border rounded shadow-lg p-3 z-10">
//                   {playlists.map((pl) => (
//                     <div key={pl._id} className="flex items-center gap-2 mb-1">
//                       <input
//                         type="checkbox"
//                         checked={selectedPlaylists[pl._id] || false}
//                         disabled={savedPlaylists[pl._id]}
//                         onChange={() => handleTogglePlaylist(pl._id)}
//                       />
//                       <span>
//                         {pl.name} {savedPlaylists[pl._id] && "✅"}
//                       </span>
//                     </div>
//                   ))}

//                   {showNewPlaylistInput ? (
//                     <div className="flex gap-2 mt-2">
//                       <input
//                         type="text"
//                         placeholder="New playlist name"
//                         value={newPlaylistName}
//                         onChange={(e) => setNewPlaylistName(e.target.value)}
//                         className="border rounded px-2 py-1 flex-1"
//                       />
//                       <button
//                         onClick={handleCreatePlaylist}
//                         className="bg-blue-600 text-white px-2 py-1 rounded"
//                       >
//                         Create
//                       </button>
//                     </div>
//                   ) : (
//                     <button
//                       onClick={() => setShowNewPlaylistInput(true)}
//                       className="mt-2 text-green-600 flex items-center gap-1 hover:text-green-800"
//                     >
//                       + New Playlist
//                     </button>
//                   )}

//                   <button
//                     onClick={handleSaveToPlaylists}
//                     className="mt-2 w-full bg-green-600 text-white px-3 py-1 rounded"
//                   >
//                     Save
//                   </button>

//                   {confirmation && <p className="text-sm text-green-700 mt-2">{confirmation}</p>}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Add Comment */}
//       <div className="mt-6">
//         <h3 className="text-lg font-semibold mb-2">Add Comment</h3>
//         <textarea
//           className="w-full border rounded-lg p-2"
//           value={newComment}
//           onChange={(e) => setNewComment(e.target.value)}
//           placeholder="Write your comment..."
//         />
//         <button onClick={handleAddComment} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg">
//           Submit
//         </button>
//       </div>

//       {/* Show Comments */}
//       <div className="mt-6">
//         <h3 className="text-lg font-semibold mb-2">Comments</h3>
//         {comments.length === 0 ? (
//           <p className="text-gray-500">No comments yet.</p>
//         ) : (
//           comments.map((c) => (
//             <div key={c._id} className="border-b py-2 flex flex-col gap-1">
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
//                   <small className="text-gray-500">By: {c.owner?.username}</small>

//                   <div className="flex items-center gap-3 mt-1">
//                     <button
//                       onClick={() => handleCommentLike(c._id)}
//                       className={`flex items-center gap-1 px-2 py-1 rounded text-white ${
//                         c.isLiked ? "bg-red-600" : "bg-blue-600"
//                       }`}
//                     >
//                       <FaThumbsUp />
//                       {c.likesCount}
//                     </button>
//                   </div>

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
import { FaThumbsUp } from "react-icons/fa";
import { toggleVideoLike, toggleCommentLike } from "../api/likeApi";
import { getAllPlaylists, addVideoToPlaylist, createPlaylist } from "../api/playlistApi";

const CommentSection = () => {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);

  const [videoLiked, setVideoLiked] = useState(false);
  const [videoLikes, setVideoLikes] = useState(0);
  const [views, setViews] = useState(0);

  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loadingSub, setLoadingSub] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState(0);

  // Playlist state
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylists, setSelectedPlaylists] = useState({});
  const [savedPlaylists, setSavedPlaylists] = useState({});
  const [showPlaylistDropdown, setShowPlaylistDropdown] = useState(false);
  const [showNewPlaylistInput, setShowNewPlaylistInput] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [confirmation, setConfirmation] = useState("");

  // Fetch current logged-in user
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

  // Fetch video + increment views
  useEffect(() => {
    if (!videoId) return;
    const fetchVideo = async () => {
      try {
        const res = await axiosInstance.get(`/videos/${videoId}`);
        const vidData = res.data.data;
        setVideo(vidData);
        setViews(vidData.views || 0);

        // Increment views
        await axiosInstance.patch(`/videos/views/${videoId}`);

        // Fetch video likes
        const likeRes = await axiosInstance.get(`/likes/count/v/${videoId}`);
setVideoLikes(likeRes.data.data.count || 0);

        // Check if current user liked this video
        const likedRes = await axiosInstance.get(`/likes/status/v/${videoId}`);
setVideoLiked(likedRes.data.data.liked || false);
      } catch (err) {
        console.error("❌ Error fetching video:", err);
      }
    };
    fetchVideo();
  }, [videoId]);

  // Subscribe logic
  useEffect(() => {
    if (!video?.owner?._id || !currentUserId) return;
    const fetchSubscriptionInfo = async () => {
      try {
        const res = await axiosInstance.get(`/subscriptions/c/${video.owner._id}`);
        const subs = res.data.data || [];
        const subscribed = subs.some((sub) => sub.subscriber._id === currentUserId);
        setIsSubscribed(subscribed);
        setSubscriberCount(subs.length);
      } catch (err) {
        console.error("❌ Error fetching subscription info:", err);
      }
    };
    fetchSubscriptionInfo();
  }, [video, currentUserId]);

  const handleToggleSub = async () => {
    if (!video?.owner?._id) return;
    setLoadingSub(true);
    try {
      await axiosInstance.post(`/subscriptions/toggle/${video.owner._id}`);
      setIsSubscribed(!isSubscribed);
      setSubscriberCount((prev) => (isSubscribed ? prev - 1 : prev + 1));
    } catch (err) {
      console.error("❌ Error toggling subscription:", err);
    } finally {
      setLoadingSub(false);
    }
  };

  // Fetch comments
  useEffect(() => {
    if (!videoId) return;
    const fetchComments = async () => {
      try {
        const res = await axiosInstance.get(`/comments/${videoId}`);
        const commentsData = res.data.data;

        // Fetch likes count for each comment
        const commentsWithLikes = await Promise.all(
  commentsData.map(async (c) => {
    try {
      const likeRes = await axiosInstance.get(`/likes/count/c/${c._id}`);
      const likedRes = await axiosInstance.get(`/likes/status/c/${c._id}`);
      return {
        ...c,
        likesCount: likeRes.data.data.count || 0,
        isLiked: likedRes.data.data.liked || false,
      };
    } catch {
      return { ...c, likesCount: 0, isLiked: false };
    }
  })
);


        setComments(commentsWithLikes);
      } catch (err) {
        console.error("❌ Error fetching comments:", err);
      }
    };
    fetchComments();
  }, [videoId]);

  // Video like handler
  const handleVideoLike = async () => {
      console.log("Like button clicked"); // ✅ check if this logs

    if (!currentUserId) return alert("❌ You must be logged in to like this video.");
    try {
      await toggleVideoLike(videoId);
      setVideoLiked((prev) => !prev);
      setVideoLikes((prev) => (videoLiked ? prev - 1 : prev + 1));
    } catch (err) {
      console.error(err);
    }
  };

  // Comment like handler
  const handleCommentLike = async (commentId) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c._id === commentId) {
          const liked = !c.isLiked;
          return {
            ...c,
            isLiked: liked,
            likesCount: liked ? c.likesCount + 1 : c.likesCount - 1,
          };
        }
        return c;
      })
    );
    try {
      await toggleCommentLike(commentId);
    } catch (err) {
      console.error(err);
    }
  };

  // Comment CRUD
  const handleAddComment = async () => {
    if (!newComment) return alert("Comment cannot be empty");
    try {
      const res = await axiosInstance.post(`/comments/${videoId}`, { comment: newComment });
      setComments((prev) => [
        { ...res.data.data, likesCount: 0, isLiked: false },
        ...prev,
      ]);
      setNewComment("");
    } catch (err) {
      console.error("❌ Error adding comment:", err);
    }
  };

  const handleEditClick = (comment) => {
    setEditingCommentId(comment._id);
    setEditText(comment.content);
  };

  const handleUpdateComment = async (id) => {
    try {
      const res = await axiosInstance.patch(`/comments/${id}`, { updatComment: editText });
      setComments((prev) => prev.map((c) => (c._id === id ? res.data.data : c)));
      setEditingCommentId(null);
      setEditText("");
    } catch (err) {
      console.error("❌ Error updating comment:", err);
    }
  };

  const handleDeleteComment = async (id) => {
    try {
      await axiosInstance.delete(`/comments/${id}`);
      setComments((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error("❌ Error deleting comment:", err);
    }
  };

  // Playlist functionality
  const fetchPlaylists = async () => {
    if (!currentUserId) return;
    try {
      const res = await getAllPlaylists(currentUserId);
      const pls = res.data || [];
      setPlaylists(pls);

      const initialSelected = {};
      const initialSaved = {};
      pls.forEach((pl) => {
        initialSelected[pl._id] = false;
        initialSaved[pl._id] = video?.videos?.includes(pl._id) || false;
      });
      setSelectedPlaylists(initialSelected);
      setSavedPlaylists(initialSaved);
    } catch (err) {
      console.error("Error fetching playlists:", err);
    }
  };

  const handleTogglePlaylist = (plId) => {
    setSelectedPlaylists((prev) => ({ ...prev, [plId]: !prev[plId] }));
  };

  const handleCreatePlaylist = async () => {
    if (!newPlaylistName.trim()) return;
    try {
      const res = await createPlaylist(currentUserId, newPlaylistName);
      const newPl = res.data.data;
      setPlaylists((prev) => [...prev, newPl]);
      setSelectedPlaylists((prev) => ({ ...prev, [newPl._id]: true }));
      setSavedPlaylists((prev) => ({ ...prev, [newPl._id]: false }));
      setNewPlaylistName("");
      setShowNewPlaylistInput(false);
    } catch (err) {
      console.error("Error creating playlist:", err);
    }
  };

  const handleSaveToPlaylists = async () => {
    const selectedIds = Object.keys(selectedPlaylists).filter(
      (id) => selectedPlaylists[id] && !savedPlaylists[id]
    );
    if (selectedIds.length === 0) {
      setConfirmation("Video already in selected playlist(s) ✅");
      return;
    }

    try {
      for (let plId of selectedIds) {
        await addVideoToPlaylist(videoId, plId);
      }

      const updatedSaved = { ...savedPlaylists };
      selectedIds.forEach((id) => (updatedSaved[id] = true));
      setSavedPlaylists(updatedSaved);

      setConfirmation(`Video saved to ${selectedIds.length} playlist(s) successfully! ✅`);
      setShowPlaylistDropdown(false);
    } catch (err) {
      console.error("Error saving video to playlists:", err);
      setConfirmation("❌ Error saving video to playlist");
    }
  };

  const handleOpenPlaylistDropdown = () => {
    fetchPlaylists();
    setShowPlaylistDropdown(true);
    setConfirmation("");
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Video */}
      {video ? (
        <div className="relative">
          <video src={video.videoUrl || video.videofile} controls className="w-full rounded-lg shadow-md" />
          <div className="flex items-center gap-4 mt-2">
            <button
              onClick={handleVideoLike}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg text-white ${
                videoLiked ? "bg-red-600" : "bg-blue-600"
              }`}
            >
              <FaThumbsUp />
              {videoLikes}
            </button>
            <span className="text-gray-500">{views} views</span>
          </div>
        </div>
      ) : (
        <p className="text-center">Loading video...</p>
      )}

      {/* Video Info & Playlist */}
      {video && (
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleSub}
              disabled={loadingSub}
              className={`px-4 py-2 rounded-lg text-white ${
                isSubscribed ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loadingSub ? "Processing..." : isSubscribed ? "Unsubscribe" : "Subscribe"}
            </button>

            {/* Playlist Dropdown */}
            <div className="relative">
              <button
                onClick={handleOpenPlaylistDropdown}
                className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
              >
                Save to Playlist
              </button>

              {showPlaylistDropdown && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white border rounded shadow-lg p-3 z-10">
                  {playlists.map((pl) => (
                    <div key={pl._id} className="flex items-center gap-2 mb-1">
                      <input
                        type="checkbox"
                        checked={selectedPlaylists[pl._id] || false}
                        disabled={savedPlaylists[pl._id]}
                        onChange={() => handleTogglePlaylist(pl._id)}
                      />
                      <span>
                        {pl.name} {savedPlaylists[pl._id] && "✅"}
                      </span>
                    </div>
                  ))}

                  {showNewPlaylistInput ? (
                    <div className="flex gap-2 mt-2">
                      <input
                        type="text"
                        placeholder="New playlist name"
                        value={newPlaylistName}
                        onChange={(e) => setNewPlaylistName(e.target.value)}
                        className="border rounded px-2 py-1 flex-1"
                      />
                      <button
                        onClick={handleCreatePlaylist}
                        className="bg-blue-600 text-white px-2 py-1 rounded"
                      >
                        Create
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowNewPlaylistInput(true)}
                      className="mt-2 text-green-600 flex items-center gap-1 hover:text-green-800"
                    >
                      + New Playlist
                    </button>
                  )}

                  <button
                    onClick={handleSaveToPlaylists}
                    className="mt-2 w-full bg-green-600 text-white px-3 py-1 rounded"
                  >
                    Save
                  </button>

                  {confirmation && <p className="text-sm text-green-700 mt-2">{confirmation}</p>}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Comment */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Add Comment</h3>
        <textarea
          className="w-full border rounded-lg p-2"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write your comment..."
        />
        <button onClick={handleAddComment} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg">
          Submit
        </button>
      </div>

      {/* Show Comments */}
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
                  <small className="text-gray-500">By: {c.owner?.username}</small>

                  <div className="flex items-center gap-3 mt-1">
                    <button
                      onClick={() => handleCommentLike(c._id)}
                      className={`flex items-center gap-1 px-2 py-1 rounded text-white ${
                        c.isLiked ? "bg-red-600" : "bg-blue-600"
                      }`}
                    >
                      <FaThumbsUp />
                      {c.likesCount}
                    </button>
                  </div>

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
