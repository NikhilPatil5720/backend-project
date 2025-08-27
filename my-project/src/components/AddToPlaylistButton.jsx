import { useState, useEffect } from "react";
import { addVideoToPlaylist, getUserPlaylists } from "../api/playlistApi";

const AddToPlaylistButton = ({ videoId }) => {
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    getUserPlaylists(userId).then((res) => setPlaylists(res.data.data));
  }, []);

  const handleAdd = async (playlistId) => {
    await addVideoToPlaylist(playlistId, videoId);
    alert("Added to playlist");
  };

  return (
    <div>
      <button className="bg-blue-500 text-white px-2 py-1 rounded">
        Add to Playlist
      </button>
      <div className="mt-2 space-y-1">
        {playlists.map((pl) => (
          <button
            key={pl._id}
            onClick={() => handleAdd(pl._id)}
            className="block w-full text-left p-1 border rounded"
          >
            {pl.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AddToPlaylistButton;
