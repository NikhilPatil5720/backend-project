// // src/pages/VideoPlayer.jsx
// import { useEffect, useState, useRef } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";

// export default function VideoPlayer() {
//   const { videoId } = useParams();
//   const [video, setVideo] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [comments, setComments] = useState([]);
//   const [newComment, setNewComment] = useState("");
//   const navigate = useNavigate();
//   const videoRef = useRef();

//   const userId = localStorage.getItem("userId"); // logged-in user
//   const token = localStorage.getItem("token");

//   // Set default Authorization header for all requests
//   axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

//   // Fetch video and increment views
//   useEffect(() => {
//     const fetchVideo = async () => {
//       try {
//         const res = await axios.get(`http://localhost:3000/api/v1/videos/${videoId}`);
//         setVideo(res.data.data);
//         // Increment views
//         await axios.patch(`http://localhost:3000/api/v1/videos/${videoId}/increment-views`);
//       } catch (err) {
//         console.error(err);
//         alert("Failed to fetch video");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchVideo();
//     fetchComments();
//   }, [videoId]);

//   // Fetch comments
//   const fetchComments = async () => {
//     try {
//       const res = await axios.get(
//         `http://localhost:3000/api/v1/comments/${videoId}?page=1&limit=50`
//       );
//       setComments(res.data?.data || []);
//     } catch (err) {
//       console.error(err);
//       alert("Failed to fetch comments");
//     }
//   };

//   // Delete video (owner only)
//   const handleDeleteVideo = async () => {
//     if (!window.confirm("Are you sure you want to delete this video?")) return;
//     try {
//       await axios.delete(`http://localhost:3000/api/v1/videos/${videoId}`);
//       alert("Video deleted");
//       navigate("/");
//     } catch (err) {
//       console.error(err);
//       alert("Error deleting video");
//     }
//   };

//   // Add new comment
//   const handleAddComment = async () => {
//     if (!newComment.trim()) return alert("Comment cannot be empty");
//     try {
//       const res = await axios.post(
//         `http://localhost:3000/api/v1/comments/${videoId}`,
//         { comment: newComment }
//       );
//       setComments([res.data?.data, ...comments]);
//       setNewComment("");
//     } catch (err) {
//       console.error(err);
//       alert("Failed to add comment");
//     }
//   };

//   // Update comment
//   const handleUpdateComment = async (comment) => {
//     const updatedText = prompt("Update your comment:", comment.content);
//     if (!updatedText) return;

//     try {
//       const res = await axios.patch(
//         `http://localhost:3000/api/v1/comments/${comment._id}`,
//         { updatComment: updatedText }
//       );
//       setComments(comments.map((c) => (c._id === comment._id ? res.data.data : c)));
//     } catch (err) {
//       console.error(err);
//       alert("Failed to update comment");
//     }
//   };

//   // Delete comment
//   const handleDeleteComment = async (commentId) => {
//     if (!window.confirm("Delete this comment?")) return;
//     try {
//       await axios.delete(`http://localhost:3000/api/v1/comments/${commentId}`);
//       setComments(comments.filter((c) => c._id !== commentId));
//     } catch (err) {
//       console.error(err);
//       alert("Failed to delete comment");
//     }
//   };

//   if (loading) return <p className="text-center mt-10">Loading video...</p>;
//   if (!video) return <p className="text-center mt-10">Video not found.</p>;

//   return (
//     <div className="max-w-4xl mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">{video.title}</h1>
//       <video
//         ref={videoRef}
//         src={video.videofile}
//         controls
//         autoPlay
//         className="w-full rounded shadow-lg"
//       />
//       <p className="mt-2 text-gray-700">{video.description}</p>
//       <p className="mt-1 text-gray-500">Uploaded by: {video.owner?.username || "Unknown"}</p>
//       <p className="mt-1 text-gray-500">{video.views} views</p>

//       {/* Video owner delete button */}
//       {video.owner?._id === userId && (
//         <div className="flex gap-2 mt-4">
//           <button
//             onClick={handleDeleteVideo}
//             className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
//           >
//             Delete Video
//           </button>
//         </div>
//       )}

//       {/* Comments */}
//       <div className="mt-6">
//         <h2 className="text-xl font-semibold mb-2">Comments</h2>
//         {/* Add new comment */}
//         <div className="flex gap-2 mb-4">
//           <input
//             type="text"
//             value={newComment}
//             onChange={(e) => setNewComment(e.target.value)}
//             placeholder="Add a comment..."
//             className="w-full border p-2 rounded"
//           />
//           <button
//             onClick={handleAddComment}
//             className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//           >
//             Comment
//           </button>
//         </div>

//         {/* List of comments */}
//         {comments.length === 0 && <p>No comments yet.</p>}
//         {comments.map((comment) => (
//           <div key={comment._id} className="border-b py-2 flex justify-between items-start">
//             <div>
//               <p className="text-gray-700">{comment.content}</p>
//               <p className="text-gray-500 text-sm">
//                 By: {comment.owner?.username || "Unknown"} | {new Date(comment.createdAt).toLocaleString()}
//               </p>
//             </div>
//             {/* Only comment owner can edit/delete */}
//             {comment.owner?._id === userId && (
//               <div className="flex flex-col gap-1">
//                 <button
//                   onClick={() => handleUpdateComment(comment)}
//                   className="text-blue-500 text-sm hover:underline"
//                 >
//                   Edit
//                 </button>
//                 <button
//                   onClick={() => handleDeleteComment(comment._id)}
//                   className="text-red-500 text-sm hover:underline"
//                 >
//                   Delete
//                 </button>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }































//version 2  full working code add coment
// src/pages/VideoPlayer.jsx
// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axiosInstance from "../utils/axiosInstance";

// const VideoPlayer = () => {
//   const { videoId } = useParams();
//   const [video, setVideo] = useState(null);
//   const [comments, setComments] = useState([]);
//   const [newComment, setNewComment] = useState("");

//   // Fetch video + increment views
//   useEffect(() => {
//     if (!videoId) return;

//     const fetchVideo = async () => {
//       try {
//         // fetch video details
//         const res = await axiosInstance.get(`/videos/${videoId}`);
//             console.log("Video data:", res.data); // 👈 check fields

//         setVideo(res.data.data);

//         // increment views (your backend expects /views/:videoId)
//         await axiosInstance.patch(`/videos/views/${videoId}`);
//       } catch (err) {
//         console.error("Error fetching video:", err);
//       }
//     };

//     fetchVideo();
//   }, [videoId]);

//   // Fetch comments
//   useEffect(() => {
//     if (!videoId) return;
//     const fetchComments = async () => {
//       try {
//         const res = await axiosInstance.get(`/comments/${videoId}`);
//         setComments(res.data.data || []);
//       } catch (err) {
//         console.error("Error fetching comments:", err);
//       }
//     };
//     fetchComments();
//   }, [videoId]);

//   // Add comment
//   const handleAddComment = async () => {
//     if (!newComment) return alert("Comment cannot be empty");
//     try {
//       const res = await axiosInstance.post(`/comments/${videoId}`, {
//         comment: newComment,
//       });
//       setComments((prev) => [res.data.data, ...prev]);
//       setNewComment("");
//     } catch (err) {
//       console.error("Error adding comment:", err);
//     }
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
//         <div className="mt-4">
//           <h2 className="text-xl font-bold">{video.title}</h2>
//           <p className="text-gray-600">{video.description}</p>
//           <p className="text-sm text-gray-500 mt-1">
//             👁 {video.views} views • 👍 {video.likes} likes
//           </p>
//         </div>
//       )}

//       {/* Comment Box */}
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

//       {/* Comments */}
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
//               <p>{c.content}</p>
//               <small className="text-gray-500">By: {c.owner}</small>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default VideoPlayer;











