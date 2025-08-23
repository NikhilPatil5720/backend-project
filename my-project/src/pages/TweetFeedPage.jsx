
import { useEffect, useState } from "react";
import { getAllTweets, getUserTweets } from "../api/TweetApi";

import TweetForm from "../components/TweetForm";
import TweetCard from "../components/TweetCard";

const TweetFeedPage = () => {
  const [myTweets, setMyTweets] = useState([]);
  const [globalTweets, setGlobalTweets] = useState([]);
  const [activeTab, setActiveTab] = useState("global"); // "my" or "global"

  // fetch my tweets
  useEffect(() => {
    const fetchMyTweets = async () => {
      try {
        const res = await getUserTweets();
        setMyTweets(res.data.data);
      } catch (err) {
        console.error("❌ Error fetching my tweets:", err);
      }
    };
    fetchMyTweets();
  }, []);

  // fetch global tweets
  useEffect(() => {
    const fetchGlobalTweets = async () => {
      try {
        const res = await getAllTweets();
        setGlobalTweets(res.data.data);
      } catch (err) {
        console.error("❌ Error fetching all tweets:", err);
      }
    };
    fetchGlobalTweets();
  }, []);

  // handlers for my tweets
  const handleTweetCreated = (newTweet) => {
    setMyTweets([newTweet, ...myTweets]);
    setGlobalTweets([newTweet, ...globalTweets]); // also update global feed
  };

  const handleTweetUpdated = (updatedTweet) => {
    setMyTweets(myTweets.map((t) => (t._id === updatedTweet._id ? updatedTweet : t)));
    setGlobalTweets(globalTweets.map((t) => (t._id === updatedTweet._id ? updatedTweet : t)));
  };

  const handleTweetDeleted = (tweetId) => {
    setMyTweets(myTweets.filter((t) => t._id !== tweetId));
    setGlobalTweets(globalTweets.filter((t) => t._id !== tweetId));
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Toggle Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("global")}
          className={`px-4 py-2 rounded-lg font-medium ${
            activeTab === "global" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          🌍 Global Feed
        </button>
        <button
          onClick={() => setActiveTab("my")}
          className={`px-4 py-2 rounded-lg font-medium ${
            activeTab === "my" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          📝 My Tweets
        </button>
      </div>

      {/* Global Feed */}
      {activeTab === "global" && (
        <section>
          <h2 className="text-xl font-bold mb-4">🌍 Global Feed</h2>
          {globalTweets.map((tweet) => (
            <div key={tweet._id} className="border p-3 mb-2 rounded">
              <p>{tweet.content}</p>
              <small className="text-gray-500">
                by {tweet.owner?.username || "Unknown"} •{" "}
                {new Date(tweet.createdAt).toLocaleString()}
              </small>
            </div>
          ))}
        </section>
      )}

      {/* My Tweets */}
      {activeTab === "my" && (
        <section>
          <h1 className="text-xl font-bold mb-4">📝 My Tweets</h1>
          <TweetForm onTweetCreated={handleTweetCreated} />
          <div>
            {myTweets.map((tweet) => (
              <TweetCard
                key={tweet._id}
                tweet={tweet}
                onUpdated={handleTweetUpdated}
                onDeleted={handleTweetDeleted}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default TweetFeedPage;
