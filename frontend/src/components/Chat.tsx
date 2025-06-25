import { useEffect, useRef, useState } from "react";

type Source = { id: string; snippet: string };

const Chat = () => {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<
  { question: string; answer: string; sources: Source[] }[]
>([]);

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);


  const askQuestion = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:3000/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Server error");
      const newEntry = {
        question,
        answer: data.answer,
        sources: data.sources,
      };

      setHistory((prev) => [...prev, newEntry]);
      setQuestion("");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">🎨 Museum Chat</h1>
      <div className="mt-10 overflow-y-scroll grow">
        {history.length > 0 && (
          <ul className="space-y-6">
            {history.map((entry, idx) => (
              <li key={idx} className="border rounded p-4">
                <p className="font-semibold">❓ {entry.question}</p>
                <p className="mt-1 whitespace-pre-wrap">✅ {entry.answer}</p>
                {entry.sources?.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium">📄 Sources:</p>
                    <ul className="list-disc list-inside text-sm text-gray-600">
                      {entry.sources.map((src, i) => (
                        <li key={i}>
                          <strong>{src.id}:</strong> {src.snippet}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && askQuestion()}
          placeholder="Ask a question..."
          className="flex-1 border border-gray-300 rounded px-4 py-2"
        />
        <button
          onClick={askQuestion}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Ask
        </button>
      </div>

      {loading && <p className="text-gray-500">⏳ Thinking...</p>}
      {error && <p className="text-red-600">❌ {error}</p>}

    </div>
  );
}


export default Chat;
