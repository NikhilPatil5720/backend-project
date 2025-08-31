import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [formData, setFormData] = useState({ email: "", oldpass: "", newpass: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/users/reset-password", formData);
      setSuccess(res.data.message);
      setError("");
      setFormData({ email: "", oldpass: "", newpass: "" });

      // redirect to login after success
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Password reset failed... Plz Enter correct details");
      setSuccess("");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-6 w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        {success && <p className="text-green-600 text-sm mb-2">{success}</p>}

        {/* Email Input */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border p-2 mb-3 rounded"
          required
        />

        {/* Old Password */}
        <input
          type="password"
          name="oldpass"
          placeholder="Current Password"
          value={formData.oldpass}
          onChange={handleChange}
          className="w-full border p-2 mb-3 rounded"
          required
        />

        {/* New Password */}
        <input
          type="password"
          name="newpass"
          placeholder="New Password"
          value={formData.newpass}
          onChange={handleChange}
          className="w-full border p-2 mb-3 rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          Change Password
        </button>
      </form>
    </div>
  );
}
