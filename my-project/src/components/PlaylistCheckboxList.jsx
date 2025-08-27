import { useEffect, useState } from "react";
import { getAllPlaylists, addVideoToPlaylist, createPlaylist } from "../api/playlistApi";
import { Plus } from "lucide-react";

const PlaylistCheckboxList = ({ videoId, onClose }) => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState({});
  const [showNewPlaylistInput, setShowNewPlaylistInput] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const fetchPlaylists = async () => {
    try {
      const res = await getAllPlaylists();
      const pls = res.data?.data || [];
      setPlaylists(pls);

      const initial = {};
      pls.forEach((pl) => (initial[pl._id] = false));
      setSelected(initial);
    } catch (err) {
      console.error("Error fetching playlists:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (playlistId) => {
    try {
      await addVideoToPlaylist(playlistId, videoId);
      setSelected((prev) => ({ ...prev, [playlistId]: !prev[playlistId] }));
    } catch (err) {
      console.error("Error updating playlist:", err);
    }
  };

  const handleCreatePlaylist = async () => {
    if (!newPlaylistName.trim()) return;

    try {
      const res = await createPlaylist({ name: newPlaylistName });
      const newPl = res.data?.data;

      if (newPl) {
        setPlaylists((prev) => [...prev, newPl]);
        setSelected((prev) => ({ ...prev, [newPl._id]: false }));
        setNewPlaylistName("");
        setShowNewPlaylistInput(false);
      }
    } catch (err) {
      console.error("Error creating playlist:", err);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="bg-white shadow-lg rounded-lg p-3 w-64">
      <h3 className="font-semibold mb-2">Save video to...</h3>
      <ul className="space-y-2 max-h-48 overflow-y-auto">
        {playlists.map((pl) => (
          <li key={pl._id} className="flex items-center">
            <input
              type="checkbox"
              checked={selected[pl._id] || false}
              onChange={() => handleToggle(pl._id)}
              className="mr-2"
            />
            {pl.name}
          </li>
        ))}
      </ul>

      {/* Create New Playlist Option */}
      {showNewPlaylistInput ? (
        <div className="mt-3 flex items-center space-x-2">
          <input
            type="text"
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
            placeholder="New playlist name"
            className="border rounded px-2 py-1 flex-1"
          />
          <button
            onClick={handleCreatePlaylist}
            className="bg-blue-600 text-white px-2 py-1 rounded"
          >
            Create
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowNewPlaylistInput(true)}
          className="mt-3 flex items-center text-blue-600 hover:text-blue-800"
        >
          <Plus className="w-4 h-4 mr-1" /> New playlist
        </button>
      )}

      <button
        onClick={onClose}
        className="mt-3 bg-gray-500 text-white px-3 py-1 rounded w-full"
      >
        Close
      </button>
    </div>
  );
};

export default PlaylistCheckboxList;
