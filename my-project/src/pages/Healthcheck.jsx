import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";

const HealthCheckPage = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHealthCheck = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("/healthcheck"); // endpoint
        setStatus(res.data.message);
      } catch (err) {
        console.error("❌ Healthcheck failed:", err);
        setError(err.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchHealthCheck();
  }, []);


  if (loading) return <p>Checking server health...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-xl mx-auto p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">Server Health Check</h1>
      <p className="text-lg text-green-600">{status}</p>
    </div>
  );
};

export default HealthCheckPage;
