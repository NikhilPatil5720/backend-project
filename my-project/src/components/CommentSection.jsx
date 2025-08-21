// src/components/CommentSection.jsx
import { useEffect, useState } from "react";
import axios from "axios";

export default function CommentSection({ videoId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 10; // number of comments per page
  const token = localStorage.getItem("token");

  // Fetch comments
  const fetchComments = async () => {
    if (!token) return;

    try {
      const res = await axios.get(
        `http://localhost:3000/api/v1/comments/${videoId}`,
        {
          params: { page, limit },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setComments(res.data.data);
    } catch (err) {
      console.error("Error fetching comments:", err);
      alert("Failed to fetch comments");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchComments();
  }, [videoId, page]);

  // Add comment
  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const res = await axios.post(
        `http://localhost:3000/api/v1/comments/${videoId}`,
        { comment: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments([res.data.data, ...comments]);
      setNewComment("");
    } catch (err) {
      console.error(err);
      alert("Failed to add comment");
    }
  };

  // Update comment
  const handleUpdateComment = async (comment) => {
    const updatedText = prompt("Update your comment:", comment.content);
    if (!updatedText) return;

    try {
      const res = await axios.patch(
        `http://localhost:3000/api/v1/comments/${comment._id}`,
        { updatComment: updatedText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments(
        comments.map((c) => (c._id === comment._id ? res.data.data : c))
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update comment");
    }
  };

  // Delete comment
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    try {
      await axios.delete(
        `http://localhost:3000/api/v1/comments/${commentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments(comments.filter((c) => c._id !== commentId));
    } catch (err) {
      console.error(err);
      alert("Failed to delete comment");
    }
  };

  if (loading) return <p>Loading comments...</p>;

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Comments</h3>
      <div className="mb-4">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="w-full border p-2 rounded mb-2"
        />
        <button
          onClick={handleAddComment}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Add Comment
        </button>
      </div>

      {comments.length === 0 && <p>No comments yet.</p>}

      <ul>
        {comments.map((comment) => (
          <li key={comment._id} className="border-b py-2">
            <p>{comment.content}</p>
            <div className="flex gap-2 mt-1">
              <button
                onClick={() => handleUpdateComment(comment)}
                className="text-blue-600 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteComment(comment._id)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>


        //fetch comment
        

      {/* Pagination (optional) */}
      {comments.length === limit && (
        <button
          onClick={() => setPage(page + 1)}
          className="mt-2 bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
        >
          Load More
        </button>
      )}
    </div>
  );
}
