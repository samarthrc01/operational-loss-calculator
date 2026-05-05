import { useState } from "react";

function AIPanel() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAskAI = async () => {
    setLoading(true);

    // Fake AI response (you can connect API later)
    setTimeout(() => {
      setResponse(`AI Suggestion: "${input}" looks like a valid loss description.`);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">AI Assistant 🤖</h2>

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask something..."
        className="border p-2 w-full mb-3 rounded"
      />

      <button
        onClick={handleAskAI}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Ask AI
      </button>

      {/* 🔄 Loading Spinner */}
      {loading && (
        <p className="mt-3 text-blue-500 animate-pulse">Thinking...</p>
      )}

      {/* 💡 Response Card */}
      {response && !loading && (
        <div className="mt-4 p-3 bg-gray-100 rounded shadow">
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}

export default AIPanel;