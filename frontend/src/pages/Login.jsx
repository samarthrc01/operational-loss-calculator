import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // ✅ FIX: correct backend URL
      const res = await API.post("/losses/login", {
        username,
        password,
      });

      console.log(res.data); // debug

      if (res.data === "success") {
        login();
        navigate("/");
      } else {
        alert("Invalid credentials ❌");
      }

    } catch (error) {
      console.error(error);
      alert("Login failed ❌");
    }
  };

  return (
    <div className="flex justify-center mt-20">
      <form onSubmit={handleLogin} className="bg-white p-6 shadow rounded w-80">
        <h2 className="text-xl mb-4 text-center font-bold">Login</h2>

        <input
          placeholder="Username"
          className="border p-2 mb-2 w-full rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 mb-3 w-full rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="bg-blue-500 hover:bg-blue-600 text-white w-full p-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;