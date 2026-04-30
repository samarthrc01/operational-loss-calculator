import { BrowserRouter, Routes, Route } from "react-router-dom";
import LossList from "./pages/LossList";
import AddLoss from "./pages/AddLoss";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LossList />} />
        <Route path="/add" element={<AddLoss />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;