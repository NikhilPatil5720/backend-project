import { useState } from "react";
import axios from "axios";

export default function Upload() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
  });
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.name === "videoFile") setVideoFile(e.target.files[0]);
    if (e.target.name === "thumbnail") setThumbnail(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("category", form.category);
      if (videoFile) formData.append("videoFile", videoFile);
      if (thumbnail) formData.append("thumbnail", thumbnail);

      const res = await axios.post("http://localhost:3000/api/v1/videos", formData, {
  withCredentials: true,
  headers: { "Content-Type": "multipart/form-data" },

          withCredentials: true,
        }
      );

      console.log("✅ Uploaded:", res.data);
      alert("Video uploaded successfully!");
    } catch (err) {
      console.error("❌ Upload error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Upload failed!");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 max-w-lg mx-auto mt-10 p-4 border rounded"
      encType="multipart/form-data"
    >
      <input
        type="text"
        name="title"
        placeholder="Video Title"
        value={form.title}
        onChange={handleChange}
        className="border p-2"
        required
      />
      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        className="border p-2"
        required
      />
      <input
        type="text"
        name="category"
        placeholder="Category"
        value={form.category}
        onChange={handleChange}
        className="border p-2"
      />
      <input
        type="file"
        name="videoFile"
        onChange={handleFileChange}
        className="border p-2"
        required
      />
      <input
        type="file"
        name="thumbnail"
        onChange={handleFileChange}
        className="border p-2"
      />
      <button type="submit" className="bg-green-500 text-white py-2 rounded">
        Upload Video
      </button>
    </form>
  );
}
