import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

function EditLoss() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchLoss();
  }, []);

  const fetchLoss = async () => {
    const res = await API.get("/losses");
    const loss = res.data.find((l) => l.id == id);
    setAmount(loss.amount);
    setDescription(loss.description);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (amount <= 0) {
      alert("Amount must be greater than 0");
      return;
    }

    if (!description) {
      alert("Description required");
      return;
    }

    await API.put(`/losses/${id}`, {
      amount: parseFloat(amount),
      description,
    });

    alert("Updated Successfully ✅");
    navigate("/");
  };

  return (
    <div className="flex justify-center mt-10">
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow rounded">
        <h2 className="text-xl mb-4">Edit Loss</h2>

        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border p-2 mb-2 w-full"
        />

        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 mb-2 w-full"
        />

        <button className="bg-blue-500 text-white px-4 py-2">
          Update
        </button>
      </form>
    </div>
  );
}

export default EditLoss;