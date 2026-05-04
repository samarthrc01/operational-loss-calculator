import { useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";

function LossList() {
  const [losses, setLosses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    fetchLosses();
  }, [page]);

  const fetchLosses = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/losses/all?page=${page}&size=5`);
      setLosses(res.data.content || []);
      setTotalPages(res.data.totalPages || 1);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      await API.delete(`/losses/${id}`);
      fetchLosses();
    } catch {
      alert("Delete failed ❌");
    }
  };

  const handleSearch = async () => {
    try {
      const res = await API.get(`/losses/search?q=${search}`);
      setLosses(res.data || []);
      setPage(0);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReset = () => {
    setSearch("");
    setPage(0);
    fetchLosses();
  };

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Loss List</h1>

        <div className="flex gap-2">
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          >
            Dashboard
          </button>

          <button
            onClick={() => navigate("/add")}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Add Loss
          </button>

          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>

      {/* SEARCH */}
      <div className="mb-6 flex gap-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-64"
          placeholder="Search description..."
        />

        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Search
        </button>

        <button
          onClick={handleReset}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Reset
        </button>
      </div>

      {/* LOADING & ERROR */}
      {loading && <p className="text-blue-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* TABLE */}
      {!loading && !error && (
        <>
          <div className="overflow-x-auto shadow rounded-lg">
            <table className="w-full">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-3">ID</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Description</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {losses
                  .filter((loss) => loss !== null)
                  .map((loss) => (
                    <tr
                      key={loss.id}
                      className="text-center border-t hover:bg-gray-100"
                    >
                      {/* ❌ NOT CLICKABLE */}
                      <td className="p-3">{loss.id}</td>

                      {/* ❌ NOT CLICKABLE */}
                      <td className="p-3">₹{loss.amount}</td>

                      {/* ✅ ONLY THIS IS CLICKABLE */}
                      <td className="p-3">
                        <span
                          className="cursor-pointer text-blue-600 hover:underline font-medium"
                          onClick={() => navigate(`/detail/${loss.id}`)}
                        >
                          {loss.description}
                        </span>
                      </td>

                      <td className="p-3">
                        <button
                          onClick={() => navigate(`/edit/${loss.id}`)}
                          className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(loss.id)}
                          className="bg-red-500 text-white px-2 py-1 rounded"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="mt-6 flex justify-center items-center gap-4">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 0}
              className="bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              Prev
            </button>

            <span className="font-medium">
              Page {page + 1} of {totalPages}
            </span>

            <button
              onClick={() => setPage(page + 1)}
              disabled={page + 1 >= totalPages}
              className="bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default LossList;