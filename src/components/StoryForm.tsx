"use client";

import { useState } from "react";

export type StoryFormData = {
  kidName: string;
  kidAge: string;
  theme: "fantasy" | "scifi" | "comedy" | "horror" | "";
  events: string;
};

type Theme = {
  id: StoryFormData["theme"];
  label: string;
  emoji: string;
  color: string;
  selectedBg: string;
};

const THEMES: Theme[] = [
  { id: "fantasy", label: "Fantasy", emoji: "🧙", color: "rgba(150,80,220,0.25)", selectedBg: "rgba(150,80,220,0.45)" },
  { id: "scifi", label: "Sci-Fi", emoji: "🚀", color: "rgba(0,180,220,0.25)", selectedBg: "rgba(0,180,220,0.45)" },
  { id: "comedy", label: "Comedy", emoji: "😄", color: "rgba(240,180,0,0.25)", selectedBg: "rgba(240,180,0,0.4)" },
  { id: "horror", label: "Horror", emoji: "👻", color: "rgba(220,40,40,0.25)", selectedBg: "rgba(220,40,40,0.4)" },
];

type Props = {
  onGenerate: (data: StoryFormData) => void;
  loading: boolean;
};

export default function StoryForm({ onGenerate, loading }: Props) {
  const [form, setForm] = useState<StoryFormData>({
    kidName: "",
    kidAge: "",
    theme: "",
    events: "",
  });

  const isValid = form.kidName.trim() && form.kidAge.trim() && form.theme && form.events.trim();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) onGenerate(form);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Kid's name & age */}
      <div className="flex gap-4">
        <div className="flex-1 flex flex-col gap-2">
          <label
            className="text-sm font-medium"
            style={{ color: "rgba(200,220,255,0.8)", fontFamily: "var(--font-inter)" }}
          >
            Child's Name
          </label>
          <input
            type="text"
            placeholder="e.g. Emma"
            value={form.kidName}
            onChange={(e) => setForm({ ...form, kidName: e.target.value })}
            className="input-field rounded-xl px-4 py-3 text-base"
            maxLength={40}
          />
        </div>
        <div style={{ width: 120 }} className="flex flex-col gap-2">
          <label
            className="text-sm font-medium"
            style={{ color: "rgba(200,220,255,0.8)", fontFamily: "var(--font-inter)" }}
          >
            Age
          </label>
          <input
            type="number"
            placeholder="5"
            value={form.kidAge}
            onChange={(e) => setForm({ ...form, kidAge: e.target.value })}
            className="input-field rounded-xl px-4 py-3 text-base"
            min={1}
            max={18}
          />
        </div>
      </div>

      {/* Theme */}
      <div className="flex flex-col gap-3">
        <label
          className="text-sm font-medium"
          style={{ color: "rgba(200,220,255,0.8)", fontFamily: "var(--font-inter)" }}
        >
          Story Theme
        </label>
        <div className="grid grid-cols-2 gap-3">
          {THEMES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setForm({ ...form, theme: t.id as StoryFormData["theme"] })}
              className={`theme-btn rounded-xl px-4 py-3 flex items-center gap-3 border text-left ${form.theme === t.id ? "selected" : ""}`}
              style={{
                background: form.theme === t.id ? t.selectedBg : t.color,
                borderColor: form.theme === t.id ? "rgba(255,215,100,0.6)" : "rgba(100,130,200,0.25)",
                color: "#e8d5b7",
                fontFamily: "var(--font-inter)",
              }}
            >
              <span className="text-2xl">{t.emoji}</span>
              <span className="font-medium">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Events / plot */}
      <div className="flex flex-col gap-2">
        <label
          className="text-sm font-medium"
          style={{ color: "rgba(200,220,255,0.8)", fontFamily: "var(--font-inter)" }}
        >
          What happened today?
        </label>
        <textarea
          placeholder="Tell me about their day… e.g. Emma went to the park, found a frog, chased butterflies, and ate ice cream."
          value={form.events}
          onChange={(e) => setForm({ ...form, events: e.target.value })}
          className="input-field rounded-xl px-4 py-3 text-base resize-none"
          rows={5}
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={!isValid || loading}
        className="relative rounded-2xl py-4 px-6 font-semibold text-lg transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
        style={{
          background: isValid && !loading
            ? "linear-gradient(135deg, #b8860b 0%, #ffd700 50%, #b8860b 100%)"
            : "rgba(100,80,30,0.4)",
          color: "#1a1200",
          fontFamily: "var(--font-inter)",
          boxShadow: isValid && !loading ? "0 0 30px rgba(255,215,0,0.3)" : "none",
        }}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-3">
            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Weaving your story…
          </span>
        ) : (
          "✨ Generate Story"
        )}
      </button>
    </form>
  );
}
