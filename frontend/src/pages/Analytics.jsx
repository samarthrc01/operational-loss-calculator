import { useEffect, useState } from "react";
import API from "../services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from "recharts";

function Analytics() {
  const [data, setData] = useState([]);
  const [period, setPeriod] = useState("all");

  useEffect(() => {
    fetchData();
  }, [period]);

  const fetchData = async () => {
    try {
      const res = await API.get("/losses");
      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ GROUP DATA BY DESCRIPTION
  const groupedData = Object.values(
    data.reduce((acc, curr) => {
      if (!acc[curr.description]) {
        acc[curr.description] = { name: curr.description, value: 0 };
      }
      acc[curr.description].value += curr.amount;
      return acc;
    }, {})
  );

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50"];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Analytics</h1>

      {/* PERIOD SELECTOR */}
      <select
        value={period}
        onChange={(e) => setPeriod(e.target.value)}
        className="border p-2 mb-6"
      >
        <option value="all">All Time</option>
        <option value="month">Last Month</option>
        <option value="week">Last Week</option>
      </select>

      {/* BAR CHART */}
      <div className="mb-10">
        <h2 className="font-semibold mb-2">Loss by Category</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={groupedData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* PIE CHART */}
      <div>
        <h2 className="font-semibold mb-2">Distribution</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={groupedData}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
            >
              {groupedData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Analytics;