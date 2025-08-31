import { useState } from "react";
import axios from "axios";
import { Progress } from "@/components/ui/progress"; // shadcn progress
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Upload() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
  });
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.name === "videoFile") setVideoFile(e.target.files[0]);
    if (e.target.name === "thumbnail") setThumbnail(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });
    setProgress(0);

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
        onUploadProgress: (p) => {
          const percent = Math.round((p.loaded * 100) / p.total);
          setProgress(percent);
        },
      });

      setStatus({ type: "success", message: "✅ Video uploaded successfully!" });
      setForm({ title: "", description: "", category: "" });
      setVideoFile(null);
      setThumbnail(null);
    } catch (err) {
      console.error("❌ Upload error:", err.response?.data || err.message);
      setStatus({
        type: "error",
        message: err.response?.data?.message || "❌ Upload failed!",
      });
    }
  };

  return (
    <Card className="max-w-lg mx-auto mt-10 shadow-xl rounded-2xl">
      <CardHeader>
        <h2 className="text-xl font-bold">📤 Upload Video</h2>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
          encType="multipart/form-data"
        >
          <div>
            <label className="block mb-1 font-medium">Title</label>
            <Input
              type="text"
              name="title"
              placeholder="Enter video title"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Description</label>
            <Textarea
              name="description"
              placeholder="Enter video description"
              value={form.description}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Category</label>
            <Input
              type="text"
              name="category"
              placeholder="Enter category"
              value={form.category}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Video File</label>
            <Input
              type="file"
              name="videoFile"
              accept="video/*"
              onChange={handleFileChange}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Thumbnail</label>
            <Input
              type="file"
              name="thumbnail"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          {progress > 0 && (
            <div className="mt-2">
              <Progress value={progress} />
              <p className="text-sm text-gray-600 mt-1">{progress}%</p>
            </div>
          )}

          {status.message && (
            <Alert
              className={`mt-2 ${status.type === "success"
                  ? "bg-green-100 border-green-400"
                  : "bg-red-100 border-red-400"
                }`}
            >
              <AlertDescription>{status.message}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
            Upload Video
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
