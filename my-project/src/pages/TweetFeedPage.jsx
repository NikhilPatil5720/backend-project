import { useEffect, useState } from "react";
import { getAllTweets, getUserTweets } from "../api/TweetApi";
import TweetForm from "../components/TweetForm";
import TweetCard from "../components/TweetCard";

const TweetFeedPage = () => {
  const [myTweets, setMyTweets] = useState([]);
  const [globalTweets, setGlobalTweets] = useState([]);
  const [activeTab, setActiveTab] = useState("global"); // "my" or "global"
  const [confirmDelete, setConfirmDelete] = useState(null);

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

  // handlers
  const handleTweetCreated = (newTweet) => {
    setMyTweets([newTweet, ...myTweets]);
    setGlobalTweets([newTweet, ...globalTweets]);
  };

  const handleTweetUpdated = (updatedTweet) => {
    setMyTweets(myTweets.map((t) => (t._id === updatedTweet._id ? updatedTweet : t)));
    setGlobalTweets(globalTweets.map((t) => (t._id === updatedTweet._id ? updatedTweet : t)));
  };

  const handleTweetDeleted = (tweetId) => {
    setMyTweets(myTweets.filter((t) => t._id !== tweetId));
    setGlobalTweets(globalTweets.filter((t) => t._id !== tweetId));
    setConfirmDelete(null);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("global")}
          className={`flex-1 py-2 rounded-lg font-semibold transition ${activeTab === "global"
              ? "bg-blue-500 text-white shadow-md"
              : "bg-gray-100 hover:bg-gray-200"
            }`}
        >
          🌍 Global Feed
        </button>
        <button
          onClick={() => setActiveTab("my")}
          className={`flex-1 py-2 rounded-lg font-semibold transition ${activeTab === "my"
              ? "bg-blue-500 text-white shadow-md"
              : "bg-gray-100 hover:bg-gray-200"
            }`}
        >
          📝 My Tweets
        </button>
      </div>

      {/* Global Feed */}
      {activeTab === "global" && (
        <section>
          <h2 className="text-xl font-bold mb-4">🌍 Global Feed</h2>
          {globalTweets.length === 0 ? (
            <p className="text-gray-500 text-center">No tweets yet.</p>
          ) : (
            globalTweets.map((tweet) => (
              <div
                key={tweet._id}
                className="bg-white border rounded-xl p-4 mb-3 shadow-sm hover:shadow-md transition"
              >
                <p className="text-gray-800">{tweet.content}</p>
                <small className="text-gray-500 block mt-2">
                  by <span className="font-medium">{tweet.owner?.username || "Unknown"}</span> •{" "}
                  {new Date(tweet.createdAt).toLocaleString()}
                </small>
              </div>
            ))
          )}
        </section>
      )}

      {/* My Tweets */}
      {activeTab === "my" && (
        <section>
          <h1 className="text-xl font-bold mb-4">📝 My Tweets</h1>
          <TweetForm onTweetCreated={handleTweetCreated} />
          <div>
            {myTweets.length === 0 ? (
              <p className="text-gray-500 text-center mt-4">You haven’t posted anything yet.</p>
            ) : (
              myTweets.map((tweet) => (
                <TweetCard
                  key={tweet._id}
                  tweet={tweet}
                  onUpdated={handleTweetUpdated}
                  onDeleted={() => setConfirmDelete(tweet._id)}
                />
              ))
            )}
          </div>
        </section>
      )}

      {/* Delete Confirmation */}
      {confirmDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
            <h2 className="text-lg font-semibold mb-3">Delete Tweet?</h2>
            <p className="text-gray-600 mb-4">Are you sure you want to delete this tweet?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleTweetDeleted(confirmDelete)}
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TweetFeedPage;
