import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditVideo = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();

  const [videoData, setVideoData] = useState({ title: "", description: "" });

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await axios.get(`/api/v1/videos/${videoId}`, { withCredentials: true });
        setVideoData({ title: res.data.title, description: res.data.description });
      } catch (err) {
        console.error(err);
      }
    };
    fetchVideo();
  }, [videoId]);

  const handleChange = (e) => {
    setVideoData({ ...videoData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/v1/videos/${videoId}`, videoData, { withCredentials: true });
      alert("Video updated successfully!");
      navigate("/my-videos");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="edit-video-page">
      <h2>Edit Video</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          value={videoData.title}
          onChange={handleChange}
          placeholder="Title"
          required
        />
        <textarea
          name="description"
          value={videoData.description}
          onChange={handleChange}
          placeholder="Description"
        />
        <button type="submit">Update Video</button>
      </form>
    </div>
  );
};

export default EditVideo;
