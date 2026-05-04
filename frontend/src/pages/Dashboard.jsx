import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function Dashboard() {
  const [stats, setStats] = useState({});
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await API.get("/losses/stats");

      setStats(res.data);

      setData([
        { name: "Total", value: res.data.totalLoss },
        { name: "Average", value: res.data.averageLoss },
        { name: "Max", value: res.data.maxLoss },
      ]);

      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to load stats");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <button
          onClick={() => navigate("/")}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Back
        </button>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-500 text-white p-5 rounded-xl shadow hover:scale-105 transition">
          <h3 className="text-sm">Total Loss</h3>
          <p className="text-2xl font-bold">₹{stats.totalLoss}</p>
        </div>

        <div className="bg-green-500 text-white p-5 rounded-xl shadow hover:scale-105 transition">
          <h3 className="text-sm">Average Loss</h3>
          <p className="text-2xl font-bold">₹{stats.averageLoss}</p>
        </div>

        <div className="bg-red-500 text-white p-5 rounded-xl shadow hover:scale-105 transition">
          <h3 className="text-sm">Max Loss</h3>
          <p className="text-2xl font-bold">₹{stats.maxLoss}</p>
        </div>

        <div className="bg-gray-800 text-white p-5 rounded-xl shadow hover:scale-105 transition">
          <h3 className="text-sm">Total Records</h3>
          <p className="text-2xl font-bold">{stats.count}</p>
        </div>
      </div>

      {/* CHART */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">Loss Overview</h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Dashboard;