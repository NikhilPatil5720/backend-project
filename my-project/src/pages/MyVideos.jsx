// // src/pages/MyVideos.jsx
// import { useEffect, useState } from "react";
// import axiosInstance from "../utils/axiosInstance"; // ✅ use the axiosInstance with cookies
// import { Link } from "react-router-dom";

// export default function MyVideos() {
//   const [videos, setVideos] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchMyVideos = async () => {
//       try {
//         // ✅ calls backend /api/v1/videos/my
//         const res = await axiosInstance.get("/videos/my");
//         setVideos(res.data?.data || []);
//       } catch (err) {
//         console.error("Error fetching my videos:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMyVideos();
//   }, []);

//   if (loading) return <p className="text-center mt-10">Loading your videos...</p>;

//   return (
//     <div className="max-w-6xl mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-6">My Videos</h1>
//       {videos.length === 0 ? (
//         <p className="text-gray-600">You haven’t uploaded any videos yet.</p>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//           {videos.map((video) => (
//             <Link
//               key={video._id}
//               to={`/videos/${video._id}`}
//               className="block border rounded-lg shadow hover:shadow-lg transition"
//             >
//               <img
//                 src={video.thumbnail || "https://via.placeholder.com/300x200"}
//                 alt={video.title}
//                 className="w-full h-48 object-cover rounded-t-lg"
//               />
//               <div className="p-3">
//                 <h2 className="font-semibold truncate">{video.title}</h2>
//                 <p className="text-sm text-gray-500">
//                   By {video.owner?.username || "Unknown"}
//                 </p>
//                 <p className="text-sm text-gray-400">{video.views} views</p>
//               </div>
//             </Link>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }




// import { useEffect, useState } from "react";
// import axiosInstance from "../utils/axiosInstance";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { toast } from "sonner";

// const MyVideos = () => {
//   const [videos, setVideos] = useState([]);
//   const [selectedVideo, setSelectedVideo] = useState(null);
//   const [editForm, setEditForm] = useState({ title: "", description: "", thumbnail: null });

//   useEffect(() => {
//     const fetchMyVideos = async () => {
//       try {
//         const res = await axiosInstance.get("/videos/my");
//         setVideos(res.data.data);
//       } catch (err) {
//         console.error("Error fetching my videos:", err);
//       }
//     };
//     fetchMyVideos();
//   }, []);

//   // Delete video
//   const handleDelete = async (videoId) => {
//     try {
//       await axiosInstance.delete(`/videos/${videoId}`);
//       setVideos(videos.filter((v) => v._id !== videoId));
//       toast.success("Video deleted successfully");
//     } catch (err) {
//       console.error("Error deleting video:", err);
//       toast.error("Failed to delete video");
//     }
//   };

//   // Open edit modal
//   const openEditModal = (video) => {
//     setSelectedVideo(video);
//     setEditForm({ title: video.title, description: video.description, thumbnail: null });
//   };

//   // Save edits
//   const handleUpdate = async () => {
//     const formData = new FormData();
//     formData.append("title", editForm.title);
//     formData.append("description", editForm.description);
//     if (editForm.thumbnail) {
//       formData.append("thumbnail", editForm.thumbnail);
//     }

//     try {
//       const res = await axiosInstance.patch(`/videos/${selectedVideo._id}`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       setVideos(videos.map((v) => (v._id === selectedVideo._id ? res.data.data : v)));
//       toast.success("Video updated successfully");
//       setSelectedVideo(null);
//     } catch (err) {
//       console.error("Error updating video:", err);
//       toast.error("Failed to update video");
//     }
//   };

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-6">My Uploaded Videos</h2>

//       <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
//         {videos.map((video) => (
//           <Card key={video._id} className="shadow-md hover:shadow-lg transition rounded-2xl">
//             <CardHeader>
//               <CardTitle className="truncate">{video.title}</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <video src={video.videoFile} controls className="w-full rounded-lg mb-3" />
//               <img
//                 src={video.thumbnail}
//                 alt="thumbnail"
//                 className="rounded-lg mb-3 h-32 w-full object-cover"
//               />
//               <div className="flex justify-between">
//                 <Button variant="outline" onClick={() => openEditModal(video)}>
//                   ✏️ Edit
//                 </Button>
//                 <Button variant="destructive" onClick={() => handleDelete(video._id)}>
//                   🗑 Delete
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       {/* Edit Video Modal */}
//       <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
//         <DialogContent className="rounded-2xl">
//           <DialogHeader>
//             <DialogTitle>Edit Video</DialogTitle>
//           </DialogHeader>

//           <Input
//             type="text"
//             placeholder="Title"
//             value={editForm.title}
//             onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
//             className="mb-3"
//           />
//           <Input
//             type="text"
//             placeholder="Description"
//             value={editForm.description}
//             onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
//             className="mb-3"
//           />
//           <Input
//             type="file"
//             accept="image/*"
//             onChange={(e) => setEditForm({ ...editForm, thumbnail: e.target.files[0] })}
//             className="mb-3"
//           />

//           <DialogFooter>
//             <Button variant="outline" onClick={() => setSelectedVideo(null)}>
//               Cancel
//             </Button>
//             <Button onClick={handleUpdate}>Save</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default MyVideos;






import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const MyVideos = () => {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", description: "", thumbnail: null });
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    const fetchMyVideos = async () => {
      try {
        const res = await axiosInstance.get("/videos/my");
        setVideos(res.data.data);
      } catch (err) {
        console.error("Error fetching my videos:", err);
      }
    };
    fetchMyVideos();
  }, []);

  // Delete video
  const handleDelete = async (videoId) => {
    try {
      await axiosInstance.delete(`/videos/${videoId}`);
      setVideos(videos.filter((v) => v._id !== videoId));
      toast.success("Video deleted successfully");
      setDeleteConfirm(null);
    } catch (err) {
      console.error("Error deleting video:", err);
      toast.error("Failed to delete video");
    }
  };

  // Open edit modal
  const openEditModal = (video) => {
    setSelectedVideo(video);
    setEditForm({ title: video.title, description: video.description, thumbnail: null });
  };

  // Save edits
  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append("title", editForm.title);
    formData.append("description", editForm.description);
    if (editForm.thumbnail) {
      formData.append("thumbnail", editForm.thumbnail);
    }

    try {
      const res = await axiosInstance.patch(`/videos/${selectedVideo._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setVideos(videos.map((v) => (v._id === selectedVideo._id ? res.data.data : v)));
      toast.success("Video updated successfully");
      setSelectedVideo(null);
    } catch (err) {
      console.error("Error updating video:", err);
      toast.error("Failed to update video");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">My Uploaded Videos</h2>

      <div className="grid md:grid-cols-5 sm:grid-cols-3 grid-cols-1 gap-6">
        {videos.map((video) => (
          <Card
            key={video._id}
            className="shadow-md hover:shadow-xl transition rounded-xl bg-white dark:bg-gray-900 border"
          >
            <CardHeader className="pb-2">
              <CardTitle className="truncate text-lg">{video.title}</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Thumbnail fully visible */}
              <img
                src={video.thumbnail}
                alt="thumbnail"
                className="rounded-lg mb-3 w-full h-auto object-contain"
              />

              <div className="flex justify-between">
                <Button size="sm" variant="outline" onClick={() => openEditModal(video)}>
                  ✏️ Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => setDeleteConfirm(video)}
                >
                  🗑 Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Video Modal */}
      <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Edit Video</DialogTitle>
          </DialogHeader>

          <Input
            type="text"
            placeholder="Title"
            value={editForm.title}
            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
            className="mb-3"
          />
          <Input
            type="text"
            placeholder="Description"
            value={editForm.description}
            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
            className="mb-3"
          />
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setEditForm({ ...editForm, thumbnail: e.target.files[0] })}
            className="mb-3"
          />

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedVideo(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600 dark:text-gray-300">
            Do you really want to delete <b>{deleteConfirm?.title}</b>? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => handleDelete(deleteConfirm._id)}>
              Yes, Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyVideos;
