import { useState } from "react";
import { updateTweet, deleteTweet } from "../api/TweetApi";

export default function TweetCard({ tweet, onUpdated, onDeleted }) {
  const [editing, setEditing] = useState(false);
  const [newContent, setNewContent] = useState(tweet.content);

  const handleUpdate = async () => {
    try {
      const res = await updateTweet(tweet._id, newContent);
      onUpdated(res.data.data);
      setEditing(false);
    } catch (err) {
      console.error("❌ Error updating tweet:", err);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTweet(tweet._id);
      onDeleted(tweet._id);
    } catch (err) {
      console.error("❌ Error deleting tweet:", err);
    }
  };

  return (
    <div className="border p-3 rounded-lg mb-2 flex justify-between items-center">
      {editing ? (
        <input
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          className="border p-1 flex-1 mr-2"
        />
      ) : (
        <p>{tweet.content}</p>
      )}
      <div className="flex gap-2">
        {editing ? (
          <button onClick={handleUpdate} className="text-green-600">Save</button>
        ) : (
          <button onClick={() => setEditing(true)} className="text-blue-600">Edit</button>
        )}
        <button onClick={handleDelete} className="text-red-600">Delete</button>
      </div>
    </div>
  );
}
