
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { FaThumbsUp, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { toggleVideoLike, toggleCommentLike } from "../api/likeApi";
import { getAllPlaylists, addVideoToPlaylist, createPlaylist } from "../api/playlistApi";

const CommentSection = () => {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);

  const [videoLiked, setVideoLiked] = useState(false);
  const [videoLikes, setVideoLikes] = useState(0);
  const [views, setViews] = useState(0);

  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loadingSub, setLoadingSub] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState(0);

  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylists, setSelectedPlaylists] = useState({});
  const [savedPlaylists, setSavedPlaylists] = useState({});
  const [showPlaylistDropdown, setShowPlaylistDropdown] = useState(false);
  const [showNewPlaylistInput, setShowNewPlaylistInput] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [confirmation, setConfirmation] = useState("");

  const userId = localStorage.getItem("userId"); //  get saved userId


  // Format views (e.g., 12,345 views)
  const formatViews = (num) =>
    num >= 1000 ? `${(num / 1000).toFixed(1)}K` : num;

  // Fetch current user
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

  // Fetch video
  useEffect(() => {
    if (!videoId) return;
    const fetchVideo = async () => {
      try {
        const res = await axiosInstance.get(`/videos/${videoId}`);
        const vidData = res.data.data;
        setVideo(vidData);
        setViews(vidData.views || 0);

        await axiosInstance.patch(`/videos/views/${videoId}`);
        const likeRes = await axiosInstance.get(`/likes/count/v/${videoId}`);
        setVideoLikes(likeRes.data.data.count || 0);
        const likedRes = await axiosInstance.get(`/likes/status/v/${videoId}`);
        setVideoLiked(likedRes.data.data.liked || false);
      } catch (err) {
        console.error("❌ Error fetching video:", err);
      }
    };
    fetchVideo();
  }, [videoId]);

  // Subscription
  useEffect(() => {
    if (!video?.owner?._id || !currentUserId) return;
    const fetchSubscriptionInfo = async () => {
      try {
        const res = await axiosInstance.get(`/subscriptions/c/${video.owner._id}`);
        const subs = res.data.data || [];
        const subscribed = subs.some((s) => s.subscriber._id === currentUserId);
        setIsSubscribed(subscribed);
        setSubscriberCount(subs.length);
      } catch (err) {
        console.error("❌ Error fetching subs:", err);
      }
    };
    fetchSubscriptionInfo();
  }, [video, currentUserId]);

  // Fetch comments
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

  // Fetch playlists
  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        if (!userId) {
          console.error("No userId found in localStorage");
          return;
        }

        const res = await getAllPlaylists(userId);
        setPlaylists(res.data);
      } catch (error) {
        console.error("❌ Error fetching playlists:", error);
      }
    };

    fetchPlaylists();
  }, [userId]);

  // Handlers
  const handleToggleSub = async () => {
    if (!video?.owner?._id) return;
    setLoadingSub(true);
    try {
      await axiosInstance.post(`/subscriptions/toggle/${video.owner._id}`);
      setIsSubscribed(!isSubscribed);
      setSubscriberCount((p) => (isSubscribed ? p - 1 : p + 1));
    } catch (err) {
      console.error("❌ Error toggling sub:", err);
    } finally {
      setLoadingSub(false);
    }
  };


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
  const handleVideoLike = async () => {
    if (!currentUserId) return alert("❌ Login to like.");
    try {
      await toggleVideoLike(videoId);
      setVideoLiked((prev) => !prev);
      setVideoLikes((prev) => (videoLiked ? prev - 1 : prev + 1));
    } catch (err) {
      console.error(err);
    }
  };

  const handleTogglePlaylist = (playlistId) => {
    setSelectedPlaylists((prev) => ({
      ...prev,
      [playlistId]: !prev[playlistId],
    }));
  };

  const handleSaveToPlaylists = async () => {
    try {
      for (const [playlistId, selected] of Object.entries(selectedPlaylists)) {
        if (selected && !savedPlaylists[playlistId]) {
          await addVideoToPlaylist(playlistId, videoId);
          setSavedPlaylists((prev) => ({ ...prev, [playlistId]: true }));
        }
      }
      setConfirmation("✅ Saved to playlists!");
    } catch (err) {
      console.error("❌ Error saving to playlist:", err);
    }
  };

  const handleCreatePlaylist = async () => {
    try {
      if (!newPlaylistName.trim()) {
        alert("Please enter a playlist name");
        return;
      }

      await createPlaylist(userId, newPlaylistName.trim());
      alert("Playlist created successfully!");
      setNewPlaylistName(""); // reset input field
    } catch (error) {
      console.error("❌ Error creating playlist:", error);
    }
  };


  return (
    <div className="max-w-4xl mx-auto p-4">
      {video ? (
        <>
          {/* Video Player */}
          <video
            src={video.videoUrl || video.videofile}
            controls
            autoPlay
            className="w-full rounded-lg shadow-lg"
          />

          {/* Title */}
          <h1 className="text-2xl font-semibold mt-3">{video.title}</h1>

          {/* Actions Row */}
          <div className="flex flex-wrap items-center justify-between border-b py-3 mt-2">
            <span className="text-gray-600">
              {formatViews(views)} views •{" "}
              {new Date(video.createdAt).toLocaleDateString()}
            </span>

            <div className="flex flex-wrap items-center gap-3">
              {/* Like */}
              <button
                onClick={handleVideoLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium ${videoLiked
                  ? "bg-red-600 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
              >
                <FaThumbsUp /> {videoLikes}
              </button>

              {/* Subscribe */}
              <button
                onClick={handleToggleSub}
                disabled={loadingSub}
                className={`px-4 py-2 rounded-full font-medium ${isSubscribed
                  ? "bg-red-600 text-white"
                  : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
              >
                {loadingSub
                  ? "Processing..."
                  : isSubscribed
                    ? `Subscribed (${subscriberCount})`
                    : `Subscribe (${subscriberCount})`}
              </button>

              {/* Playlist */}
              <div className="relative">
                <button
                  onClick={() => setShowPlaylistDropdown((s) => !s)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700"
                >
                  <FaPlus /> Save
                </button>
                {showPlaylistDropdown && (
                  <div className="absolute right-0 mt-2 w-72 bg-white border rounded shadow-lg p-3 z-10">
                    <h4 className="font-semibold mb-2">Your Playlists</h4>
                    {playlists.length > 0 ? (
                      playlists.map((pl) => (
                        <label key={pl._id} className="flex items-center gap-2 py-1">
                          <input
                            type="checkbox"
                            checked={!!selectedPlaylists[pl._id]}
                            onChange={() => handleTogglePlaylist(pl._id)}
                          />
                          <span>{pl.name}</span>
                        </label>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">No playlists yet</p>
                    )}

                    <button
                      onClick={handleSaveToPlaylists}
                      className="mt-3 w-full bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700"
                    >
                      Save
                    </button>

                    {showNewPlaylistInput ? (
                      <div className="mt-3">
                        <input
                          type="text"
                          value={newPlaylistName}
                          onChange={(e) => setNewPlaylistName(e.target.value)}
                          placeholder="New playlist name"
                          className="border w-full p-1 rounded"
                        />
                        <button
                          onClick={handleCreatePlaylist}
                          className="mt-2 w-full bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700"
                        >
                          Create
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowNewPlaylistInput(true)}
                        className="mt-3 w-full text-blue-600 text-sm"
                      >
                        + New Playlist
                      </button>
                    )}

                    {confirmation && (
                      <p className="text-sm text-green-700 mt-2">{confirmation}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Add Comment */}
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

          {/* Comments */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">
              {comments.length} Comments
            </h3>
            {comments.length === 0 ? (
              <p className="text-gray-500">No comments yet. Be the first!</p>
            ) : (
              comments.map((c) => (
                <div key={c._id} className="border-b py-3">
                  <p className="font-medium">{c.owner?.username}</p>
                  <p>{c.content}</p>
                  <div className="flex gap-3 mt-2">
                    <button
                      onClick={async () => {
                        try {
                          await toggleCommentLike(c._id);

                          setComments((prev) =>
                            prev.map((comment) => {
                              if (comment._id === c._id) {
                                const currentCount = Number(comment.likesCount) || 0; //  always a number
                                return {
                                  ...comment,
                                  isLiked: !comment.isLiked,
                                  likesCount: comment.isLiked
                                    ? currentCount - 1
                                    : currentCount + 1,
                                };
                              }
                              return comment;
                            })
                          );
                        } catch (err) {
                          console.error("❌ Error toggling comment like:", err);
                        }
                      }}
                      className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${c.isLiked
                        ? "bg-red-600 text-white"
                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                        }`}
                    >
                      <FaThumbsUp /> {Number(c.likesCount) || 0}
                    </button>

                    {c.owner?._id === currentUserId && (
                      <>
                        <button className="flex items-center gap-1 px-3 py-1 bg-yellow-500 text-white rounded-full text-sm hover:bg-yellow-600">
                          <FaEdit /> Edit
                        </button>
                        <button className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded-full text-sm hover:bg-red-600">
                          <FaTrash /> Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        <p className="text-center">Loading video...</p>
      )}
    </div>
  );
};

export default CommentSection;



