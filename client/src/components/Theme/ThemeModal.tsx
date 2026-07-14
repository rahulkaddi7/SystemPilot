import { X } from "lucide-react";

interface ThemeModalProps {
  isOpen: boolean;
  currentTheme: "light" | "dark" | "system";
  onClose: () => void;
  onSelect: (theme: "light" | "dark" | "system") => void;
}

const ThemeModal = ({
  isOpen,
  currentTheme,
  onClose,
  onSelect,
}: ThemeModalProps) => {
  if (!isOpen) return null;

  const themes = ["system", "light", "dark"] as const;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-96 rounded-2xl bg-[var(--card)] shadow-xl">

        <div className="flex items-center justify-between border-b border-[var(--border)] p-5">
          <h2 className="text-lg font-semibold text-[var(--text)]">
            Choose Theme
          </h2>

          <button onClick={onClose}>
            <X className="text-[var(--secondary)]" />
          </button>
        </div>

        <div className="p-5 space-y-3">

          {themes.map((theme) => (
            <button
              key={theme}
              onClick={() => {
                onSelect(theme);
                onClose();
              }}
              className={`w-full rounded-xl border px-4 py-3 text-left transition
                ${
                  currentTheme === theme
                    ? "border-[var(--primary)] bg-[var(--hover)]"
                    : "border-[var(--border)] hover:bg-[var(--hover)]"
                }`}
            >
              <p className="capitalize font-medium text-[var(--text)]">
                {theme}
              </p>
            </button>
          ))}

        </div>
      </div>
    </div>
  );
};

export default ThemeModal;