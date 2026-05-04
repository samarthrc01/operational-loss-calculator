import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";

function LossDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loss, setLoss] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLoss();
  }, []);

  const fetchLoss = async () => {
    try {
      const res = await API.get(`/losses/${id}`); // ✅ FIXED
      setLoss(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  // ✅ DELETE
  const handleDelete = async () => {
    if (!window.confirm("Delete this loss?")) return;

    try {
      await API.delete(`/losses/${id}`);
      alert("Deleted successfully ✅");
      navigate("/");
    } catch {
      alert("Delete failed ❌");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-center">Loss Detail</h2>

      <div className="space-y-2">
        <p><b>ID:</b> {loss.id}</p>
        <p><b>Amount:</b> ₹{loss.amount}</p>
        <p><b>Description:</b> {loss.description}</p>
      </div>

      {/* ✅ SCORE BADGE */}
      <div className="mt-4">
        <span
          className={`px-3 py-1 rounded text-white ${
            loss.amount > 1000 ? "bg-red-500" : "bg-green-500"
          }`}
        >
          {loss.amount > 1000 ? "High Loss" : "Low Loss"}
        </span>
      </div>

      {/* ACTION BUTTONS */}
      <div className="mt-6 flex justify-between">
        <button
          onClick={() => navigate(`/edit/${loss.id}`)}
          className="bg-yellow-500 text-white px-4 py-2 rounded"
        >
          Edit
        </button>

        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Delete
        </button>

        <button
          onClick={() => navigate("/")}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Back
        </button>
      </div>
    </div>
  );
}

export default LossDetail;