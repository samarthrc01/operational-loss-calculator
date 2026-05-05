import { useNavigate } from "react-router-dom";
import { useEffect, useState, useContext, useMemo } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import debounce from "lodash/debounce";

function LossList() {
  const [losses, setLosses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(""); // ✅ NEW
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  // ✅ NORMAL FETCH (pagination)
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

  useEffect(() => {
    if (!search && !status) {
      fetchLosses();
    }
  }, [page, search, status]);

  // ✅ DEBOUNCED SEARCH + STATUS
  const debouncedSearch = useMemo(
    () =>
      debounce(async (value, statusValue) => {
        try {
          setLoading(true);
          const res = await API.get(
            `/losses/filter?q=${value}&deleted=${statusValue}`
          );
          setLosses(res.data || []);
          setTotalPages(1); // disable pagination
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      }, 500),
    []
  );

  // ✅ SEARCH INPUT
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (value.trim() === "" && !status) {
      fetchLosses();
    } else {
      debouncedSearch(value, status);
    }
  };

  // ✅ STATUS FILTER
  const handleStatus = (value) => {
    setStatus(value);

    if (!search && value === "") {
      fetchLosses();
    } else {
      debouncedSearch(search, value);
    }
  };

  // ✅ CLEANUP
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      await API.delete(`/losses/${id}`);
      fetchLosses();
    } catch {
      alert("Delete failed ❌");
    }
  };

  const handleReset = () => {
    setSearch("");
    setStatus("");
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
            className="bg-purple-500 text-white px-4 py-2 rounded"
          >
            Dashboard
          </button>

          <button
            onClick={() => navigate("/add")}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Add Loss
          </button>
          <button
            onClick={() => navigate("/ai")}
            className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
          >
            AI Panel
          </button>
          <button
            onClick={() => navigate("/analytics")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Analytics
          </button>


          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>

      {/* 🔍 FILTERS (UPDATED) */}
      <div className="mb-6 flex gap-2 items-center">
        {/* SEARCH */}
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          className="border p-2 rounded w-64"
          placeholder="Search description..."
        />

        {/* STATUS DROPDOWN */}
        <select
          value={status}
          onChange={(e) => handleStatus(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All</option>
          <option value="false">Active</option>
          <option value="true">Deleted</option>
        </select>

        {/* RESET */}
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
                {losses.map((loss) => (
                  <tr key={loss.id} className="text-center border-t">
                    <td className="p-3">{loss.id}</td>

                    <td className="p-3">₹{loss.amount}</td>

                    <td className="p-3">
                      <span
                        className="cursor-pointer text-blue-600 hover:underline"
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
          {!search && !status && (
            <div className="mt-6 flex justify-center items-center gap-4">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 0}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Prev
              </button>

              <span>
                Page {page + 1} of {totalPages}
              </span>

              <button
                onClick={() => setPage(page + 1)}
                disabled={page + 1 >= totalPages}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default LossList;