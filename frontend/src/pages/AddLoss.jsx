import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function AddLoss() {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/losses", {
        amount: parseFloat(amount),
        description: description,
      });

      setSuccess("Loss added successfully ✅");
      setError("");

      // clear form
      setAmount("");
      setDescription("");

      // redirect after 1 sec
      setTimeout(() => {
        navigate("/");
      }, 1000);

    } catch (err) {
      console.error(err);
      setError("Error adding loss ❌");
      setSuccess("");
    }
  };

  return (
    <div className="flex justify-center mt-10">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg p-6 rounded-xl w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">
          Add Loss
        </h2>

        {/* Success message */}
        {success && (
          <p className="text-green-500 text-center mb-2">{success}</p>
        )}

        {/* Error message */}
        {error && (
          <p className="text-red-500 text-center mb-2">{error}</p>
        )}

        <input
          type="number"
          placeholder="Enter Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
          required
        />

        <input
          type="text"
          placeholder="Enter Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Add Loss
        </button>

        {/* Back button */}
        <button
          type="button"
          onClick={() => navigate("/")}
          className="w-full mt-3 text-blue-500"
        >
          Back to List
        </button>
      </form>
    </div>
  );
}

export default AddLoss;