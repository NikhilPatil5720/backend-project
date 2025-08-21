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
  const [coverImg, setCoverImg] = useState(null); // 🔹 changed name

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.name === "avatar") setAvatar(e.target.files[0]);
    if (e.target.name === "coverImg") setCoverImg(e.target.files[0]); // 🔹 match backend
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("username", form.username);
      formData.append("email", form.email);
      formData.append("fullname", form.fullname);
      formData.append("password", form.password);
      if (avatar) formData.append("avatar", avatar);
      if (coverImg) formData.append("coverImg", coverImg); // 🔹 match backend

      const res = await axios.post(
        "http://localhost:3000/api/v1/users/register",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      console.log("✅ Registered:", res.data);
    } catch (err) {
      console.error("❌ Error:", err.response?.data || err.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 max-w-md mx-auto"
      encType="multipart/form-data"
    >
      <input
        type="text"
        name="fullname"
        placeholder="Full Name"
        value={form.fullname}
        onChange={handleChange}
        className="border p-2"
      />
      <input
        type="text"
        name="username"
        placeholder="Username"
        value={form.username}
        onChange={handleChange}
        className="border p-2"
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        className="border p-2"
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        className="border p-2"
      />
      <input
        type="file"
        name="avatar"
        onChange={handleFileChange}
        className="border p-2"
        required
      />
      <input
        type="file"
        name="coverImg" // 🔹 fixed name
        onChange={handleFileChange}
        className="border p-2"
      />
      <button type="submit" className="bg-blue-500 text-white py-2 rounded">
        Register
      </button>
    </form>
  );
}
