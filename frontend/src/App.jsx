import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LossList from "./pages/LossList";
import AddLoss from "./pages/AddLoss";
import EditLoss from "./pages/EditLoss";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import LossDetail from "./pages/LossDetail";
import ProtectedRoute from "./components/ProtectedRoute";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

function App() {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <Routes>

        {/* 🔐 Login Page (Prevent access if already logged in) */}
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/" /> : <Login />
          }
        />

        {/* 🔒 Protected Routes */}

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* List Page */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <LossList />
            </ProtectedRoute>
          }
        />

        {/* Add */}
        <Route
          path="/add"
          element={
            <ProtectedRoute>
              <AddLoss />
            </ProtectedRoute>
          }
        />

        {/* Edit */}
        <Route
          path="/edit/:id"
          element={
            <ProtectedRoute>
              <EditLoss />
            </ProtectedRoute>
          }
        />

        {/* Detail */}
        <Route
          path="/detail/:id"
          element={
            <ProtectedRoute>
              <LossDetail />
            </ProtectedRoute>
          }
        />

        {/* ✅ DEFAULT REDIRECT */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;