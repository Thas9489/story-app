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

  useEffect(() => {
    setApiKey(localStorage.getItem("openrouter_api_key") ?? "");
  }, []);

  const handleKeySet = (key: string) => {
    setApiKey(key);
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
        <header className="text-center pt-12 pb-6 px-6">
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

            {/* Subtle API key link at bottom of form */}
            <div className="mt-5 pt-4" style={{ borderTop: "1px solid rgba(100,130,200,0.12)" }}>
              <button
                onClick={() => setShowKeyModal(true)}
                className="flex items-center gap-2 text-xs transition-opacity hover:opacity-100 opacity-50"
                style={{ color: "rgba(150,170,220,0.9)", fontFamily: "var(--font-inter)" }}
              >
                <span>⚙</span>
                <span>{apiKey ? "API key configured · change" : "Configure API Key"}</span>
              </button>
            </div>
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

      <ApiKeyModal
        isOpen={showKeyModal}
        onClose={() => setShowKeyModal(false)}
        onSave={handleKeySet}
      />
    </div>
  );
}
