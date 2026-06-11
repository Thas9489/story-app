"use client";

type Props = {
  story: string;
  kidName: string;
  theme: string;
};

const THEME_DECORATIONS: Record<string, { border: string; title: string; icon: string }> = {
  fantasy: { border: "rgba(150,80,220,0.5)", title: "A Magical Tale", icon: "🧙‍✨" },
  scifi:   { border: "rgba(0,180,220,0.5)",  title: "A Cosmic Adventure", icon: "🚀🌌" },
  comedy:  { border: "rgba(240,180,0,0.5)",  title: "A Hilarious Adventure", icon: "😄🎉" },
  horror:  { border: "rgba(220,40,40,0.5)",  title: "A Spooky Night", icon: "👻🕯️" },
};

export default function StoryOutput({ story, kidName, theme }: Props) {
  const deco = THEME_DECORATIONS[theme] ?? { border: "rgba(255,215,100,0.4)", title: "A Bedtime Story", icon: "🌙" };

  const handleCopy = () => {
    navigator.clipboard.writeText(story);
  };

  return (
    <div
      className="rounded-3xl p-8 flex flex-col gap-6 relative overflow-hidden"
      style={{
        background: "rgba(8, 15, 35, 0.85)",
        border: `1px solid ${deco.border}`,
        boxShadow: `0 0 40px ${deco.border}`,
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Decorative corner stars */}
      <div className="absolute top-4 left-4 text-yellow-300 opacity-30 text-2xl select-none">★</div>
      <div className="absolute top-4 right-16 text-yellow-200 opacity-20 text-lg select-none">✦</div>
      <div className="absolute bottom-4 right-4 text-yellow-300 opacity-30 text-xl select-none">★</div>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p
            className="text-xs uppercase tracking-widest mb-1"
            style={{ color: "rgba(150,170,220,0.7)", fontFamily: "var(--font-inter)" }}
          >
            {deco.title}
          </p>
          <h2
            className="text-3xl font-semibold leading-tight"
            style={{ color: "#ffd700", fontFamily: "var(--font-crimson)" }}
          >
            {kidName}&apos;s Story {deco.icon}
          </h2>
        </div>
        <button
          onClick={handleCopy}
          title="Copy story"
          className="shrink-0 rounded-xl px-4 py-2 text-sm transition-all hover:opacity-80"
          style={{
            background: "rgba(255,215,100,0.1)",
            border: "1px solid rgba(255,215,100,0.3)",
            color: "rgba(255,215,100,0.8)",
            fontFamily: "var(--font-inter)",
          }}
        >
          Copy
        </button>
      </div>

      {/* Divider */}
      <div
        className="w-full h-px"
        style={{ background: `linear-gradient(to right, transparent, ${deco.border}, transparent)` }}
      />

      {/* Story text */}
      <div
        className="story-text text-lg overflow-y-auto max-h-[60vh] pr-2"
        style={{ color: "#e8d5b7", fontFamily: "var(--font-crimson)" }}
      >
        {story.split("\n").map((paragraph, i) =>
          paragraph.trim() ? (
            <p key={i} className="mb-4 leading-relaxed">
              {paragraph}
            </p>
          ) : null
        )}
      </div>

      {/* Footer */}
      <div
        className="text-center text-sm pt-2"
        style={{
          color: "rgba(150,170,220,0.5)",
          fontFamily: "var(--font-crimson)",
          borderTop: "1px solid rgba(100,130,200,0.15)",
        }}
      >
        ✦ Sweet dreams ✦
      </div>
    </div>
  );
}
