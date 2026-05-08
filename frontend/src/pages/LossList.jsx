import { useNavigate } from "react-router-dom";
import { useEffect, useState, useContext, useMemo } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import debounce from "lodash/debounce";
import "./LossPage.css"; // ✅ ADD CSS

function LossList() {
  const [losses, setLosses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  // ✅ FETCH
  const fetchLosses = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/losses/all?page=${page}&size=5`);
      setLosses(res.data.content || []);
      setTotalPages(res.data.totalPages || 1);
      setError("");
    } catch {
      setError("Unable to fetch losses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!search && !status) {
      fetchLosses();
    }
  }, [page, search, status]);

  // ✅ DEBOUNCE SEARCH
  const debouncedSearch = useMemo(
    () =>
      debounce(async (value, statusValue) => {
        try {
          setLoading(true);

          const res = await API.get("/losses/filter", {
            params: {
              q: value || undefined,
              deleted:
                statusValue === ""
                  ? undefined
                  : statusValue === "true",
              page: 0,
              size: 5,
            },
          });

          setLosses(res.data.content || []);
          setTotalPages(res.data.totalPages || 1);
          setPage(0);
        } catch {
          setError("Filter failed ❌");
        } finally {
          setLoading(false);
        }
      }, 500),
    []
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (value.trim() === "" && !status) {
      fetchLosses();
    } else {
      debouncedSearch(value, status);
    }
  };

  const handleStatus = (value) => {
    setStatus(value);

    if (!search && value === "") {
      fetchLosses();
    } else {
      debouncedSearch(search, value);
    }
  };

  useEffect(() => {
    return () => debouncedSearch.cancel();
  }, [debouncedSearch]);

  // ✅ DELETE (better UX)
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this record?");
    if (!confirmDelete) return;

    try {
      await API.delete(`/losses/${id}`);
      fetchLosses();
    } catch {
      setError("Delete failed ❌");
    }
  };

  const handleReset = () => {
    setSearch("");
    setStatus("");
    setPage(0);
    fetchLosses();
  };

  return (
    <div className="container">

      {/* HEADER */}
      <h1 className="title">📊 Loss Dashboard</h1>

      {/* NAV BUTTONS */}
      <div className="top-actions">
        <button onClick={() => navigate("/dashboard")}>Dashboard</button>
        <button onClick={() => navigate("/add")}>Add Loss</button>
        <button onClick={() => navigate("/ai")}>AI Panel</button>
        <button onClick={() => navigate("/analytics")}>Analytics</button>
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
        >
          Logout
        </button>
      </div>

      {/* FILTER */}
      <div className="search-bar">
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search description..."
        />

        <select
          value={status}
          onChange={(e) => handleStatus(e.target.value)}
        >
          <option value="">All</option>
          <option value="false">Active</option>
          <option value="true">Deleted</option>
        </select>

        <button onClick={handleReset}>Reset</button>
      </div>

      {/* LOADING */}
      {loading && <p className="text-center">Loading...</p>}

      {/* ERROR */}
      {error && <p className="error text-center">{error}</p>}

      {/* TABLE */}
      {!loading && !error && (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Amount</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {losses.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center">
                    No data found
                  </td>
                </tr>
              ) : (
                losses.map((loss) => (
                  <tr key={loss.id}>
                    <td>{loss.id}</td>
                    <td>₹{loss.amount}</td>

                    <td
                      className="cursor-pointer"
                      onClick={() => navigate(`/detail/${loss.id}`)}
                    >
                      {loss.description}
                    </td>

                    <td>
                      <button
                        className="action-btn edit-btn"
                        onClick={() => navigate(`/edit/${loss.id}`)}
                      >
                        Edit
                      </button>

                      <button
                        className="action-btn delete-btn"
                        onClick={() => handleDelete(loss.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* PAGINATION */}
      {!search && !status && !loading && (
        <div className="pagination">
          <button onClick={() => setPage(page - 1)} disabled={page === 0}>
            Prev
          </button>

          <span>
            Page {page + 1} of {totalPages}
          </span>

          <button
            onClick={() => setPage(page + 1)}
            disabled={page + 1 >= totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default LossList;