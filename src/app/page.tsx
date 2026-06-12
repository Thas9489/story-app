"use client";

import { useState, useEffect } from "react";
import StarBackground from "@/components/StarBackground";
import StoryForm, { StoryFormData } from "@/components/StoryForm";
import StoryOutput from "@/components/StoryOutput";
import ApiKeyModal from "@/components/ApiKeyModal";

export default function Home() {
  const [story, setStory] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastForm, setLastForm] = useState<StoryFormData | null>(null);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [apiKey, setApiKey] = useState<string>("");
  const [keySet, setKeySet] = useState(false);

  // Load key from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("openrouter_api_key") ?? "";
    setApiKey(stored);
    setKeySet(!!stored);
  }, []);

  const handleKeySet = (key: string) => {
    setApiKey(key);
    setKeySet(!!key);
  };

  const handleGenerate = async (data: StoryFormData) => {
    setLoading(true);
    setError(null);
    setLastForm(data);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, apiKey: apiKey || undefined }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to generate story.");
      setStory(json.story);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen" style={{ fontFamily: "var(--font-inter)" }}>
      <StarBackground />

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="text-center pt-10 pb-6 px-6 relative">
          {/* Settings button */}
          <button
            onClick={() => setShowKeyModal(true)}
            title="Configure API Key"
            className="absolute top-10 right-6 flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition-all hover:opacity-80"
            style={{
              background: keySet
                ? "rgba(60,180,60,0.12)"
                : "rgba(220,80,80,0.12)",
              border: `1px solid ${keySet ? "rgba(100,220,100,0.3)" : "rgba(220,80,80,0.35)"}`,
              color: keySet ? "rgba(120,220,120,0.9)" : "rgba(255,140,140,0.9)",
              fontFamily: "var(--font-inter)",
            }}
          >
            <span>{keySet ? "🔑" : "⚠️"}</span>
            <span className="hidden sm:inline">{keySet ? "API Key Set" : "Set API Key"}</span>
          </button>

          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="text-3xl">🌙</span>
            <h1
              className="text-5xl font-semibold tracking-tight"
              style={{ color: "#ffd700", fontFamily: "var(--font-crimson)", textShadow: "0 0 30px rgba(255,215,0,0.4)" }}
            >
              Dreamweaver
            </h1>
            <span className="text-3xl">✨</span>
          </div>
          <p
            className="text-lg max-w-md mx-auto"
            style={{ color: "rgba(180,200,240,0.7)" }}
          >
            Transform your child&apos;s day into a magical bedtime story
          </p>
        </header>

        {/* No API key banner */}
        {!keySet && (
          <div className="w-full max-w-6xl mx-auto px-6 mb-2">
            <button
              onClick={() => setShowKeyModal(true)}
              className="w-full rounded-2xl px-5 py-3 text-sm text-left flex items-center gap-3 transition-all hover:opacity-90"
              style={{
                background: "rgba(180,80,20,0.18)",
                border: "1px solid rgba(255,140,60,0.35)",
                color: "rgba(255,190,120,0.95)",
                fontFamily: "var(--font-inter)",
              }}
            >
              <span className="text-lg">⚠️</span>
              <span>
                <strong>No API key configured.</strong> Click here to add your OpenRouter API key to start generating stories.
              </span>
            </button>
          </div>
        )}

        {/* Main layout */}
        <main className="flex-1 w-full max-w-6xl mx-auto px-6 pb-12 flex flex-col lg:flex-row gap-8 items-start">
          {/* Form panel */}
          <div
            className="w-full lg:w-[440px] shrink-0 rounded-3xl p-8"
            style={{
              background: "rgba(8, 15, 40, 0.75)",
              border: "1px solid rgba(100,130,200,0.2)",
              backdropFilter: "blur(16px)",
              boxShadow: "0 8px 40px rgba(0,0,20,0.5)",
            }}
          >
            <h2
              className="text-xl font-semibold mb-6"
              style={{ color: "rgba(200,220,255,0.9)", fontFamily: "var(--font-crimson)" }}
            >
              Tell me about their day
            </h2>
            <StoryForm onGenerate={handleGenerate} loading={loading} />
          </div>

          {/* Output panel */}
          <div className="flex-1 w-full">
            {error && (
              <div
                className="rounded-2xl px-6 py-4 mb-4 text-base"
                style={{
                  background: "rgba(180,30,30,0.2)",
                  border: "1px solid rgba(220,60,60,0.4)",
                  color: "#ffaaaa",
                }}
              >
                {error}
              </div>
            )}

            {story && lastForm ? (
              <StoryOutput story={story} kidName={lastForm.kidName} theme={lastForm.theme} />
            ) : (
              <div
                className="rounded-3xl p-10 flex flex-col items-center justify-center text-center min-h-64"
                style={{
                  background: "rgba(8, 15, 35, 0.5)",
                  border: "1px solid rgba(100,130,200,0.12)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <div className="text-6xl mb-4 opacity-40">📖</div>
                <p
                  className="text-lg mb-2"
                  style={{ color: "rgba(150,170,220,0.6)", fontFamily: "var(--font-crimson)" }}
                >
                  Your story will appear here
                </p>
                <p
                  className="text-sm"
                  style={{ color: "rgba(100,120,180,0.5)" }}
                >
                  Fill in the details and press &quot;Generate Story&quot;
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={showKeyModal}
        onClose={() => setShowKeyModal(false)}
        onSave={handleKeySet}
      />
    </div>
  );
}
