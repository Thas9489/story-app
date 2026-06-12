"use client";

import { useState, useEffect } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (key: string) => void;
};

export default function ApiKeyModal({ isOpen, onClose, onSave }: Props) {
  const [value, setValue] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const stored = localStorage.getItem("openrouter_api_key") ?? "";
      setValue(stored);
      setSaved(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    localStorage.setItem("openrouter_api_key", trimmed);
    onSave(trimmed);
    setSaved(true);
    setTimeout(() => onClose(), 900);
  };

  const handleClear = () => {
    localStorage.removeItem("openrouter_api_key");
    setValue("");
    onSave("");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-md rounded-3xl p-8 flex flex-col gap-6"
        style={{
          background: "rgba(8, 15, 45, 0.97)",
          border: "1px solid rgba(255,215,100,0.25)",
          boxShadow: "0 0 60px rgba(0,0,20,0.8)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2
              className="text-2xl font-semibold"
              style={{ color: "#ffd700", fontFamily: "var(--font-crimson)" }}
            >
              ⚙️ API Key Settings
            </h2>
            <p className="text-sm mt-1" style={{ color: "rgba(150,170,220,0.7)", fontFamily: "var(--font-inter)" }}>
              Your key is stored locally in your browser only.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-2xl leading-none opacity-50 hover:opacity-100 transition-opacity"
            style={{ color: "#e8d5b7" }}
          >
            ×
          </button>
        </div>

        {/* Divider */}
        <div className="w-full h-px" style={{ background: "rgba(255,215,100,0.15)" }} />

        {/* Input */}
        <div className="flex flex-col gap-2">
          <label
            className="text-sm font-medium"
            style={{ color: "rgba(200,220,255,0.8)", fontFamily: "var(--font-inter)" }}
          >
            OpenRouter API Key
          </label>
          <input
            type="password"
            placeholder="sk-or-v1-..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            className="input-field rounded-xl px-4 py-3 text-base font-mono"
            autoComplete="off"
            spellCheck={false}
          />
          <p className="text-xs" style={{ color: "rgba(120,140,190,0.6)", fontFamily: "var(--font-inter)" }}>
            Get your free key at{" "}
            <a
              href="https://openrouter.ai/keys"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "rgba(180,200,255,0.8)", textDecoration: "underline" }}
            >
              openrouter.ai/keys
            </a>
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={!value.trim() || saved}
            className="flex-1 rounded-xl py-3 font-semibold text-base transition-all disabled:opacity-40"
            style={{
              background: saved
                ? "rgba(60,180,60,0.4)"
                : "linear-gradient(135deg, #b8860b 0%, #ffd700 50%, #b8860b 100%)",
              color: saved ? "#aaffaa" : "#1a1200",
              fontFamily: "var(--font-inter)",
              boxShadow: !saved && value.trim() ? "0 0 20px rgba(255,215,0,0.25)" : "none",
            }}
          >
            {saved ? "✓ Saved!" : "Save Key"}
          </button>
          {value && (
            <button
              onClick={handleClear}
              className="rounded-xl px-4 py-3 text-sm transition-all hover:opacity-80"
              style={{
                background: "rgba(180,30,30,0.15)",
                border: "1px solid rgba(220,60,60,0.3)",
                color: "rgba(255,150,150,0.8)",
                fontFamily: "var(--font-inter)",
              }}
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
