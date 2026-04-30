import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";

function LossList() {
  const [losses, setLosses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLosses();
  }, []);

  const fetchLosses = async () => {
    try {
      const res = await API.get("/losses");
      setLosses(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      {/* Title + Button */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Loss List</h1>

        <button
          onClick={() => navigate("/add")}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Add Loss
        </button>
      </div>

      {/* Loading */}
      {loading && <p className="text-blue-500">Loading...</p>}

      {/* Error */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Table */}
      {!loading && !error && (
        <table className="w-full border rounded-lg overflow-hidden shadow">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Description</th>
            </tr>
          </thead>

          <tbody>
            {losses.map((loss) => (
              <tr
                key={loss.id}
                className="text-center border-t hover:bg-gray-100"
              >
                <td className="p-3">{loss.id}</td>
                <td className="p-3">{loss.amount}</td>
                <td className="p-3">{loss.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default LossList;