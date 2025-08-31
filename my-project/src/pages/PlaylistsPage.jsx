import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const MyPlaylistsPage = () => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null); // for update
  const [deletePlaylist, setDeletePlaylist] = useState(null); // for delete
  const [form, setForm] = useState({ name: "", description: "" });

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const res = await axiosInstance.get(`/playlists/user/${userId}`);
        setPlaylists(res.data.data);
      } catch (err) {
        console.error("Error fetching playlists", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlaylists();
  }, [userId]);

  const handleDelete = async () => {
    if (!deletePlaylist) return;
    try {
      await axiosInstance.delete(`/playlists/${deletePlaylist._id}`);
      setPlaylists(playlists.filter((pl) => pl._id !== deletePlaylist._id));
      setDeletePlaylist(null);
      alert("Playlist deleted successfully!");
    } catch (err) {
      console.error("Error deleting playlist", err);
      alert("Failed to delete playlist");
    }
  };

  const handleUpdate = async () => {
    if (!selectedPlaylist) return;
    try {
      const res = await axiosInstance.put(`/playlists/${selectedPlaylist._id}`, {
        name: form.name,
        description: form.description,
      });
      setPlaylists(
        playlists.map((pl) =>
          pl._id === selectedPlaylist._id ? res.data.data : pl
        )
      );
      setSelectedPlaylist(null);
      alert("Playlist updated successfully!");
    } catch (err) {
      console.error("Error updating playlist", err);
      alert("Failed to update playlist");
    }
  };

  if (loading)
    return (
      <div className="p-6 flex justify-center items-center h-screen">
        <p className="text-lg text-gray-500">Loading playlists...</p>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        My Playlists
      </h1>

      {playlists.length === 0 ? (
        <p className="text-gray-500 text-lg">No playlists yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {playlists.map((playlist) => (
            <div
              key={playlist._id}
              className="bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-700 dark:via-gray-800 dark:to-gray-900 
             rounded-2xl shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-1 p-5 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-xl font-bold text-blue-500 mb-2 hover:underline cursor-pointer">
                  {playlist.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                  {playlist.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-3 mt-auto">
                <Button
                  onClick={() => navigate(`/playlist/${playlist._id}`)}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full px-4 py-2 hover:scale-105 transition"
                >
                  Videos
                </Button>
                <Button
                  onClick={() => {
                    setSelectedPlaylist(playlist);
                    setForm({
                      name: playlist.name,
                      description: playlist.description,
                    });
                  }}
                  className="bg-yellow-500 text-white rounded-full px-4 py-2 hover:scale-105 transition"
                >
                  Update
                </Button>
                <Button
                  onClick={() => setDeletePlaylist(playlist)}
                  className="bg-red-500 text-white rounded-full px-4 py-2 hover:scale-105 transition"
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Update Modal */}
      <Dialog open={!!selectedPlaylist} onOpenChange={() => setSelectedPlaylist(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Playlist</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Playlist Name"
            />
            <Textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Description"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedPlaylist(null)}>
              Cancel
            </Button>
            <Button className="bg-yellow-500 text-white" onClick={handleUpdate}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={!!deletePlaylist} onOpenChange={() => setDeletePlaylist(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete playlist{" "}
            <span className="font-bold">{deletePlaylist?.name}</span> and all its
            videos?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletePlaylist(null)}>
              Cancel
            </Button>
            <Button className="bg-red-500 text-white" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyPlaylistsPage;
