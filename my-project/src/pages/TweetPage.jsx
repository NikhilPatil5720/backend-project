import { useEffect, useState } from "react";
import { getUserTweets } from "../api/TweetApi";
import TweetForm from "../components/TweetForm";
import TweetCard from "../components/TweetCard";

export default function TweetPage() {
  const [tweets, setTweets] = useState([]);

  useEffect(() => {
    fetchTweets();
  }, []);

  const fetchTweets = async () => {
    try {
      const res = await getUserTweets();
      setTweets(res.data.data);
    } catch (err) {
      console.error("❌ Error fetching tweets:", err);
    }
  };

  const handleTweetCreated = (newTweet) => {
    setTweets([newTweet, ...tweets]);
  };

  const handleTweetUpdated = (updatedTweet) => {
    setTweets(tweets.map((t) => (t._id === updatedTweet._id ? updatedTweet : t)));
  };

  const handleTweetDeleted = (tweetId) => {
    const confirmDelete = window.confirm("🗑️ Are you sure you want to delete this tweet?");
    if (!confirmDelete) return;

    setTweets(tweets.filter((t) => t._id !== tweetId));
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <h1 className="text-3xl font-extrabold text-center text-blue-600 dark:text-blue-400 mb-6">
        ✦ My Tweets
      </h1>

      {/* Tweet Form Card */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-5 mb-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3">
          Create a Tweet
        </h2>
        <TweetForm onTweetCreated={handleTweetCreated} />
      </div>

      {/* Tweets Feed */}
      <div className="space-y-5">
        {tweets.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 text-lg italic">
            No tweets yet... Be the first to post 🚀
          </p>
        ) : (
          tweets.map((tweet) => (
            <div
              key={tweet._id}
              className="bg-gradient-to-br from-gray-50 via-white to-gray-100 
                        dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 
                        rounded-2xl shadow-md hover:shadow-xl transition 
                        border border-gray-200 dark:border-gray-700"
            >
              <TweetCard
                tweet={tweet}
                onUpdated={handleTweetUpdated}
                onDeleted={handleTweetDeleted}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
