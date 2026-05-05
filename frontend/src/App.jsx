import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LossList from "./pages/LossList";
import AddLoss from "./pages/AddLoss";
import EditLoss from "./pages/EditLoss";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import LossDetail from "./pages/LossDetail";
import AIPanel from "./pages/AIPanel";
import Analytics from "./pages/Analytics"; // ✅ NEW (Day 10)
import ProtectedRoute from "./components/ProtectedRoute";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

function App() {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <Routes>

        {/* 🔐 Login */}
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/" /> : <Login />
          }
        />

        {/* 🔒 Protected Routes */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <LossList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add"
          element={
            <ProtectedRoute>
              <AddLoss />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit/:id"
          element={
            <ProtectedRoute>
              <EditLoss />
            </ProtectedRoute>
          }
        />

        <Route
          path="/detail/:id"
          element={
            <ProtectedRoute>
              <LossDetail />
            </ProtectedRoute>
          }
        />

        {/* 🤖 AI PANEL (Day 8) */}
        <Route
          path="/ai"
          element={
            <ProtectedRoute>
              <AIPanel />
            </ProtectedRoute>
          }
        />

        {/* 📊 ANALYTICS PAGE (Day 10 🔥) */}
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />

        {/* Default */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;