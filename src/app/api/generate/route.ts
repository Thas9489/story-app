import { NextRequest, NextResponse } from "next/server";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

const THEME_PROMPTS: Record<string, string> = {
  fantasy:
    "a whimsical high-fantasy story with magical creatures, enchanted lands, wizards, and a heroic quest. Use vivid, imaginative language full of wonder.",
  scifi:
    "an exciting science-fiction adventure set in space or the future, with robots, spaceships, alien friends, and cool technology. Make it feel futuristic and adventurous.",
  comedy:
    "a hilarious, laugh-out-loud comedy story with silly misunderstandings, funny characters, absurd situations, and a feel-good ending. Use playful, witty language.",
  horror:
    "a mildly spooky (age-appropriate, not traumatizing) Halloween-style story with friendly ghosts, mysterious shadows, and a gentle scare that ends happily and safely.",
};

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { kidName, kidAge, theme, events, apiKey: clientKey } = body;

  // Client-supplied key takes priority; fall back to server env var
  const apiKey = (clientKey as string | undefined)?.trim() || process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "No API key found. Click ⚙ Configure API Key at the bottom of the form and enter your OpenRouter key." },
      { status: 401 }
    );
  }

  if (!kidName || !kidAge || !theme || !events) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const themeDescription = THEME_PROMPTS[theme] ?? "an engaging bedtime story";
  const ageNum = parseInt(kidAge, 10);
  const readingLevel =
    ageNum <= 4
      ? "very simple words, very short sentences, suitable for toddlers"
      : ageNum <= 7
      ? "simple words and short paragraphs, suitable for early readers"
      : ageNum <= 10
      ? "clear and engaging language suitable for primary school children"
      : "rich and descriptive language suitable for a pre-teen";

  const systemPrompt = `You are a gifted children's story writer who creates magical, immersive bedtime stories. Your stories are warm, vivid, and perfectly tailored to the child's age. Always write in second or third person centered on the child as the hero. Stories should be 400–600 words, written in clear paragraphs. End with a gentle, sleepy conclusion that eases the child toward sleep.`;

  const userPrompt = `Write ${themeDescription} for a ${ageNum}-year-old child named ${kidName}. Use ${readingLevel}.

The story must be inspired by these real events from ${kidName}'s day:
"${events}"

Weave these events naturally into the story's plot, transforming them through the ${theme} lens. Make ${kidName} the brave and clever hero. End the story gently, with ${kidName} drifting off to sleep after their adventure.`;

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
        "X-Title": "Dreamweaver Story Generator",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.3-70b-instruct:free",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        max_tokens: 900,
        temperature: 0.85,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("OpenRouter error:", err);
      return NextResponse.json({ error: "Failed to generate story. Please try again." }, { status: 502 });
    }

    const data = await response.json();
    const story = data.choices?.[0]?.message?.content ?? "";

    if (!story) {
      return NextResponse.json({ error: "No story returned. Please try again." }, { status: 502 });
    }

    return NextResponse.json({ story });
  } catch (err) {
    console.error("Story generation error:", err);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}
