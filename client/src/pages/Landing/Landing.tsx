import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex justify-center items-center bg-[var(--bg)] text-[var(--text)]">
      <div className="text-center">
        <h1 className="text-6xl font-bold">LearnGPT</h1>

        <p className="mt-4 text-[var(--secondary)]">
          Learn anything through conversations.
        </p>

        <button
          onClick={() => navigate("/chat")}
          className="
            mt-10
            px-8
            py-4
            rounded-xl
            border
            border-[var(--primary)]
            text-[var(--text)]
            hover:bg-[var(--primary)]
            hover:text-white
            transition
          "
        >
          Start Learning
        </button>
      </div>
    </div>
  );
}