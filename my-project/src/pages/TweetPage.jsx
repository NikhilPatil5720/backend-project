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
    setTweets(tweets.map(t => t._id === updatedTweet._id ? updatedTweet : t));
  };

  const handleTweetDeleted = (tweetId) => {
    setTweets(tweets.filter(t => t._id !== tweetId));
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">My Tweets</h1>
      <TweetForm onTweetCreated={handleTweetCreated} />
      <div>
        {tweets.map(tweet => (
          <TweetCard
            key={tweet._id}
            tweet={tweet}
            onUpdated={handleTweetUpdated}
            onDeleted={handleTweetDeleted}
          />
        ))}
      </div>
    </div>
  );
}
