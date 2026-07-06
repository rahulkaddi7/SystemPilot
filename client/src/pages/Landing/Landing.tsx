import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold">LearnGPT</h1>
        <p className="text-gray-500 mt-4">
          Learn anything through conversations.
        </p>
        <button
          onClick={() => navigate("/chat")}
          className="mt-10 px-8 py-4 rounded-xl border border-blue-500 hover:bg-blue-500 hover:text-white transition"
        >
          Start Learning
        </button>
      </div>
    </div>
  );
}
