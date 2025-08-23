import { useState } from "react";
import { createTweet } from "../api/TweetApi";

export default function TweetForm({ onTweetCreated }) {
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      const res = await createTweet(content);
      setContent("");
      onTweetCreated(res.data.data); // add the new tweet to parent
    } catch (err) {
      console.error("❌ Error creating tweet:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's happening?"
        className="flex-1 border rounded-lg p-2"
      />
      <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
        Tweet
      </button>
    </form>
  );
}
