import { useState } from "react";
import axios from "axios";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    fullname: "",
    password: "",
  });
  const [avatar, setAvatar] = useState(null);
  const [coverImg, setCoverImg] = useState(null);
  const [loading, setLoading] = useState(false); // 🔹 loading state
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.name === "avatar") setAvatar(e.target.files[0]);
    if (e.target.name === "coverImg") setCoverImg(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("username", form.username);
      formData.append("email", form.email);
      formData.append("fullname", form.fullname);
      formData.append("password", form.password);
      if (avatar) formData.append("avatar", avatar);
      if (coverImg) formData.append("coverImg", coverImg);

      const res = await axios.post(
        "http://localhost:3000/api/v1/users/register",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      setSuccess("✅ Registered successfully!");
      console.log(" Registered:", res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed!");
      console.error("❌ Error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-green-100 to-blue-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg"
        encType="multipart/form-data"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Create an Account
        </h2>

        {error && <p className="text-red-500 text-center mb-3">{error}</p>}
        {success && <p className="text-green-600 text-center mb-3">{success}</p>}

        <div className="flex flex-col gap-4">
          <label className="font-semibold text-gray-700">
            Full Name
            <input
              type="text"
              name="fullname"
              placeholder="Enter your full name"
              value={form.fullname}
              onChange={handleChange}
              className="mt-1 border p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-400"
              required
            />
          </label>

          <label className="font-semibold text-gray-700">
            Username
            <input
              type="text"
              name="username"
              placeholder="Choose a username"
              value={form.username}
              onChange={handleChange}
              className="mt-1 border p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-400"
              required
            />
          </label>

          <label className="font-semibold text-gray-700">
            Email
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              className="mt-1 border p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-400"
              required
            />
          </label>

          <label className="font-semibold text-gray-700">
            Password
            <input
              type="password"
              name="password"
              placeholder="Enter a strong password"
              value={form.password}
              onChange={handleChange}
              className="mt-1 border p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-400"
              required
            />
          </label>

          <label className="font-semibold text-gray-700">
            Profile Picture (Avatar)
            <input
              type="file"
              name="avatar"
              onChange={handleFileChange}
              className="mt-1 border p-2 rounded-lg w-full"
              required
            />
          </label>

          <label className="font-semibold text-gray-700">
            Cover Image
            <input
              type="file"
              name="coverImg"
              onChange={handleFileChange}
              className="mt-1 border p-2 rounded-lg w-full"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold text-white transition ${loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
              }`}
          >
            {loading ? "⏳ Please wait..." : "Register"}
          </button>
        </div>
      </form>
    </div>
  );
}
