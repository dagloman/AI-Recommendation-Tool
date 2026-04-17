import React, { useEffect, useMemo, useState } from "react";

type Tool = {
  name: string;
  url: string;
  categories: string[];
  bestFor: string;
  strengths: string[];
  limitations: string;
  beginner: boolean;
  powerUser: boolean;
  freeTier: boolean;
};

type Preferences = {
  freeOnly: boolean;
  beginnerOnly: boolean;
  businessFocus: boolean;
  creativeFocus: boolean;
  fastestOption: boolean;
};

type RankedTool = Tool & {
  score: number;
  reasons: string[];
  matchedCategories: string[];
};

const tools: Tool[] = [
  {
    name: "ChatGPT",
    url: "https://chatgpt.com/",
    categories: ["writing", "research", "summaries", "presentations", "general", "brainstorming", "productivity"],
    bestFor: "General-purpose help, writing, planning, summaries, and broad task support.",
    strengths: ["Great all-around tool", "Strong writing and reasoning", "Good for brainstorming"],
    limitations: "Not the most specialized for IDE-native coding or pro graphic design.",
    beginner: true,
    powerUser: true,
    freeTier: true,
  },
  {
    name: "Claude",
    url: "https://claude.ai/",
    categories: ["writing", "analysis", "summaries", "general", "brainstorming", "research"],
    bestFor: "Long-form writing, analysis, and polished text output.",
    strengths: ["Strong writing quality", "Good for detailed analysis", "Clear responses"],
    limitations: "Less specialized for visual design or code-editor workflows.",
    beginner: true,
    powerUser: true,
    freeTier: true,
  },
  {
    name: "Gemini",
    url: "https://gemini.google.com/",
    categories: ["writing", "research", "presentations", "productivity", "general", "brainstorming"],
    bestFor: "Google-friendly workflows, brainstorming, and productivity tasks.",
    strengths: ["Great for Google ecosystem users", "Good general assistant", "Useful for planning"],
    limitations: "Less ideal if you want a single specialized design or coding-first tool.",
    beginner: true,
    powerUser: false,
    freeTier: true,
  },
  {
    name: "GitHub Copilot",
    url: "https://github.com/features/copilot",
    categories: ["coding", "debugging", "developer workflow"],
    bestFor: "Coding, fixing bugs, refactoring, and developer productivity.",
    strengths: ["Strong for code completion", "Helpful inside dev workflows", "Great for debugging help"],
    limitations: "Not meant for design, slide decks, or general consumer tasks.",
    beginner: false,
    powerUser: true,
    freeTier: false,
  },
  {
    name: "Canva",
    url: "https://www.canva.com/",
    categories: ["presentations", "design", "social", "image generation"],
    bestFor: "Presentations, social graphics, fast design work, and visual content.",
    strengths: ["Very beginner-friendly", "Fast design output", "Great for slides and visuals"],
    limitations: "Not the best choice for deep research or advanced coding.",
    beginner: true,
    powerUser: false,
    freeTier: true,
  },
  {
    name: "Midjourney",
    url: "https://www.midjourney.com/",
    categories: ["image generation", "design", "creative"],
    bestFor: "Creative image generation and highly stylized visuals.",
    strengths: ["Excellent image quality", "Great for concept art", "Strong creative style output"],
    limitations: "Not for writing, spreadsheets, or general productivity tasks.",
    beginner: false,
    powerUser: true,
    freeTier: false,
  },
  {
    name: "Adobe Firefly",
    url: "https://firefly.adobe.com/",
    categories: ["image generation", "design", "creative", "editing"],
    bestFor: "Image generation, editing, and Adobe-centered creative workflows.",
    strengths: ["Good for creators", "Useful for edits and graphics", "Fits Adobe workflows"],
    limitations: "Less useful for general research or coding.",
    beginner: true,
    powerUser: true,
    freeTier: true,
  },
  {
    name: "Perplexity",
    url: "https://www.perplexity.ai/",
    categories: ["research", "summaries", "general"],
    bestFor: "Research, web-backed answers, and fast information gathering.",
    strengths: ["Great for research", "Fast answers", "Useful for comparing sources"],
    limitations: "Less suited for design-heavy or coding-native workflows.",
    beginner: true,
    powerUser: false,
    freeTier: true,
  },
  {
    name: "Microsoft Copilot",
    url: "https://copilot.microsoft.com/",
    categories: ["writing", "productivity", "research", "presentations", "general"],
    bestFor: "Microsoft 365 workflows, workplace productivity, and business assistance.",
    strengths: ["Fits Office users well", "Useful for documents and productivity", "Good enterprise fit"],
    limitations: "Less specialized for design-first or coding-native workflows.",
    beginner: true,
    powerUser: false,
    freeTier: true,
  },
  {
    name: "Notion AI",
    url: "https://www.notion.so/product/ai",
    categories: ["writing", "productivity", "summaries", "planning"],
    bestFor: "Notes, internal docs, planning, and workspace productivity.",
    strengths: ["Good inside notes workflows", "Helpful for summaries", "Strong organization support"],
    limitations: "Best when you already use Notion a lot.",
    beginner: true,
    powerUser: false,
    freeTier: false,
  },
  {
    name: "Grammarly",
    url: "https://www.grammarly.com/",
    categories: ["writing", "editing", "productivity"],
    bestFor: "Polishing writing, grammar correction, and clarity improvements.",
    strengths: ["Easy to use", "Great for clean writing", "Helpful across many writing surfaces"],
    limitations: "Not a strong choice for deep research, coding, or image generation.",
    beginner: true,
    powerUser: false,
    freeTier: true,
  },
  {
    name: "Jasper",
    url: "https://www.jasper.ai/",
    categories: ["writing", "marketing", "productivity"],
    bestFor: "Marketing copy, brand content, and business writing workflows.",
    strengths: ["Strong for copywriting", "Good for teams", "Useful for content workflows"],
    limitations: "Less useful for coding, research-heavy tasks, or design.",
    beginner: true,
    powerUser: true,
    freeTier: false,
  },
  {
    name: "Runway",
    url: "https://runwayml.com/",
    categories: ["video generation", "creative", "editing", "design"],
    bestFor: "AI video creation, editing, and motion content.",
    strengths: ["Strong for video workflows", "Useful for creators", "Good visual tools"],
    limitations: "Not ideal for general writing or coding tasks.",
    beginner: true,
    powerUser: true,
    freeTier: true,
  },
  {
    name: "Synthesia",
    url: "https://www.synthesia.io/",
    categories: ["video generation", "presentations", "productivity"],
    bestFor: "AI presenter videos, training videos, and business explainers.",
    strengths: ["Good for business video", "Fast presentation-style output", "Useful for training content"],
    limitations: "Less suited for deep design, coding, or research.",
    beginner: true,
    powerUser: false,
    freeTier: false,
  },
  {
    name: "Cursor",
    url: "https://www.cursor.com/",
    categories: ["coding", "debugging", "developer workflow"],
    bestFor: "AI-assisted coding, debugging, and fast software development workflows.",
    strengths: ["Built for developers", "Good repo-aware assistance", "Strong coding focus"],
    limitations: "Not meant for slide decks, design, or general consumer tasks.",
    beginner: false,
    powerUser: true,
    freeTier: true,
  },
  {
    name: "Replit AI",
    url: "https://replit.com/",
    categories: ["coding", "debugging", "developer workflow"],
    bestFor: "Building and testing code quickly in a browser-based environment.",
    strengths: ["Easy for fast prototyping", "Good for lightweight projects", "Accessible in browser"],
    limitations: "Less ideal for non-coding workflows or pro design work.",
    beginner: true,
    powerUser: false,
    freeTier: true,
  },
  {
    name: "Zapier AI",
    url: "https://zapier.com/ai",
    categories: ["automation", "productivity", "workflow"],
    bestFor: "Automations, workflow building, and connecting apps together.",
    strengths: ["Great for automation", "Connects many apps", "Useful for saving time"],
    limitations: "Not the best fit for deep writing, design, or creative tasks.",
    beginner: true,
    powerUser: true,
    freeTier: true,
  },
  {
    name: "ElevenLabs",
    url: "https://elevenlabs.io/",
    categories: ["audio", "creative", "editing"],
    bestFor: "Voice generation, narration, and audio content creation.",
    strengths: ["Strong voice quality", "Good for narration", "Useful for media projects"],
    limitations: "Not meant for general writing, coding, or research.",
    beginner: true,
    powerUser: true,
    freeTier: true,
  },
  {
    name: "Suno",
    url: "https://suno.com/",
    categories: ["music", "creative", "audio"],
    bestFor: "AI music generation and quick song creation.",
    strengths: ["Great for music creation", "Fast creative output", "Fun and easy to explore"],
    limitations: "Not useful for coding, research, or productivity tasks.",
    beginner: true,
    powerUser: false,
    freeTier: true,
  },
  {
    name: "Descript",
    url: "https://www.descript.com/",
    categories: ["audio", "video generation", "editing", "productivity"],
    bestFor: "Podcast editing, video editing, and transcript-based media workflows.",
    strengths: ["Great for editing spoken content", "Useful for creators", "Good transcript workflows"],
    limitations: "Less useful for general writing, coding, or research-heavy work.",
    beginner: true,
    powerUser: true,
    freeTier: true,
  },
];

const keywordMap: Record<string, string[]> = {
  coding: ["code", "coding", "program", "script", "developer", "bug", "debug", "refactor", "app", "website", "api", "software", "build app"],
  writing: ["write", "writing", "essay", "report", "email", "letter", "resume", "cover letter", "blog", "rewrite", "polish wording", "draft"],
  research: ["research", "compare", "find information", "sources", "web", "search", "look up", "investigate", "best option", "learn about"],
  summaries: ["summarize", "summary", "pdf", "document", "notes", "transcript", "condense", "key points"],
  presentations: ["slides", "presentation", "deck", "powerpoint", "pitch deck", "slideshow"],
  productivity: ["plan", "organize", "schedule", "productivity", "workflow", "tasks", "to do", "manage work", "stay organized"],
  planning: ["plan", "roadmap", "strategy", "outline", "next steps", "game plan"],
  design: ["design", "graphic", "flyer", "poster", "branding", "logo", "brochure", "visual"],
  "image generation": ["image", "photo", "picture", "art", "illustration", "generate image", "thumbnail", "mockup"],
  creative: ["creative", "concept art", "fantasy", "stylized", "brainstorm ideas", "creative concept"],
  editing: ["edit image", "remove background", "retouch", "edit photo", "edit video", "edit audio", "revise"],
  "video generation": ["video", "make video", "create video", "training video", "youtube", "shorts", "reel", "avatar video", "explainer video"],
  automation: ["automation", "automate", "connect apps", "workflow automation", "save time", "integrate", "trigger", "zap"],
  audio: ["audio", "voice", "narration", "podcast", "voiceover", "speech", "recording"],
  music: ["music", "song", "beat", "soundtrack", "jingle", "compose"],
  marketing: ["marketing", "ad copy", "sales copy", "campaign", "social media content", "promotion", "brand content"],
  workflow: ["workflow", "process", "pipeline", "system", "repeatable task"],
  analysis: ["analyze", "analysis", "break down", "evaluate", "review", "deep dive"],
  debugging: ["fix bug", "troubleshoot", "debug", "error", "broken code"],
  general: ["help me", "best tool", "ai tool"],
};

const preferenceOptions = [
  { id: "freeOnly", label: "Free only" },
  { id: "beginnerOnly", label: "Beginner friendly" },
  { id: "businessFocus", label: "Best for business" },
  { id: "creativeFocus", label: "Best for creative work" },
  { id: "fastestOption", label: "Fastest to use" },
] as const;

const examples = [
  "I need help writing a report and polishing the wording",
  "I want to build a website and fix coding bugs",
  "I need to make a presentation from my notes",
  "I want to automate repetitive tasks between my apps",
  "I need to create a training video with voiceover",
  "I want to edit a podcast and clean up the audio",
];

function classifyTask(input: string): string[] {
  const text = input.toLowerCase();
  const matched = new Set<string>();

  Object.entries(keywordMap).forEach(([category, keywords]) => {
    keywords.forEach((keyword) => {
      if (text.includes(keyword)) matched.add(category);
    });
  });

  if (text.includes("school") || text.includes("study") || text.includes("homework")) {
    matched.add("writing");
    matched.add("research");
    matched.add("summaries");
  }

  if (text.includes("job") || text.includes("interview") || text.includes("career")) {
    matched.add("writing");
    matched.add("productivity");
  }

  if (text.includes("business") || text.includes("work")) {
    matched.add("productivity");
    matched.add("planning");
  }

  if (text.includes("social media") || text.includes("instagram") || text.includes("youtube")) {
    matched.add("marketing");
    matched.add("design");
  }

  if (text.includes("presentation") || text.includes("pitch")) {
    matched.add("presentations");
    matched.add("design");
  }

  if (text.includes("voice") || text.includes("podcast")) {
    matched.add("audio");
    matched.add("editing");
  }

  if (text.includes("music") || text.includes("song")) {
    matched.add("music");
    matched.add("creative");
  }

  if (matched.size === 0) matched.add("general");
  return Array.from(matched);
}

function scoreTool(tool: Tool, categories: string[], text: string, preferences: Preferences) {
  let score = 0;
  const reasons: string[] = [];

  const primaryCategory = categories[0];
  const secondaryCategories = categories.slice(1);

  categories.forEach((category, index) => {
    if (tool.categories.includes(category)) {
      const weight = index === 0 ? 7 : 4;
      score += weight;
      reasons.push(index === 0 ? `Best fit for your main task: ${category}` : `Good fit for ${category}`);
    }
  });

  if (primaryCategory && tool.categories.includes(primaryCategory) && secondaryCategories.some((cat) => tool.categories.includes(cat))) {
    score += 3;
    reasons.push("Handles mixed-task workflows well");
  }

  if (text.includes("beginner") && tool.beginner) {
    score += 2;
    reasons.push("Beginner friendly");
  }

  if ((text.includes("advanced") || text.includes("professional")) && tool.powerUser) {
    score += 2;
    reasons.push("Great for advanced users");
  }

  if ((text.includes("free") || text.includes("cheap") || text.includes("budget")) && tool.freeTier) {
    score += 3;
    reasons.push("Has a free or low-cost starting point");
  }

  if (text.includes("google") && tool.name === "Gemini") {
    score += 4;
    reasons.push("Optimized for Google tools");
  }

  if ((text.includes("microsoft") || text.includes("office") || text.includes("excel") || text.includes("word")) && tool.name === "Microsoft Copilot") {
    score += 4;
    reasons.push("Works especially well with Microsoft workflows");
  }

  if ((text.includes("code") || text.includes("developer") || text.includes("bug") || text.includes("debug")) && tool.categories.includes("coding")) {
    score += 4;
    reasons.push("Built for coding workflows");
  }

  if ((text.includes("design") || text.includes("visual") || text.includes("graphics") || text.includes("logo")) && tool.categories.includes("design")) {
    score += 4;
    reasons.push("Strong visual/design capabilities");
  }

  if ((text.includes("video") || text.includes("youtube") || text.includes("training video") || text.includes("explainer")) && tool.categories.includes("video generation")) {
    score += 4;
    reasons.push("Great for video creation");
  }

  if ((text.includes("audio") || text.includes("podcast") || text.includes("voice") || text.includes("voiceover")) && tool.categories.includes("audio")) {
    score += 4;
    reasons.push("Great for audio tasks");
  }

  if ((text.includes("music") || text.includes("song") || text.includes("beat")) && tool.categories.includes("music")) {
    score += 4;
    reasons.push("Strong fit for music creation");
  }

  if ((text.includes("automate") || text.includes("automation") || text.includes("connect apps") || text.includes("save time")) && tool.categories.includes("automation")) {
    score += 4;
    reasons.push("Strong fit for automation workflows");
  }

  if ((text.includes("marketing") || text.includes("campaign") || text.includes("sales copy") || text.includes("ads")) && tool.categories.includes("marketing")) {
    score += 3;
    reasons.push("Useful for marketing tasks");
  }

  if (preferences.freeOnly) {
    if (tool.freeTier) {
      score += 4;
      reasons.push("Matches your free-only preference");
    } else {
      score -= 8;
    }
  }

  if (preferences.beginnerOnly) {
    if (tool.beginner) {
      score += 4;
      reasons.push("Matches your beginner-friendly preference");
    } else {
      score -= 5;
    }
  }

  if (preferences.businessFocus && ["Microsoft Copilot", "Jasper", "Synthesia", "Notion AI", "ChatGPT", "Gemini"].includes(tool.name)) {
    score += 4;
    reasons.push("Strong fit for business workflows");
  }

  if (preferences.creativeFocus && ["Canva", "Midjourney", "Adobe Firefly", "Runway", "Suno", "ElevenLabs", "Descript"].includes(tool.name)) {
    score += 4;
    reasons.push("Strong fit for creative work");
  }

  if (preferences.fastestOption && ["ChatGPT", "Canva", "Perplexity", "Grammarly", "Microsoft Copilot", "Replit AI"].includes(tool.name)) {
    score += 3;
    reasons.push("Fast to get started with");
  }

  if (score === 0 && tool.name === "ChatGPT") {
    score = 2;
    reasons.push("Strong general-purpose fallback");
  }

  return { score, reasons };
}

function ResultCard({
  label,
  labelClass,
  tool,
}: {
  label: string;
  labelClass: string;
  tool: RankedTool;
}) {
  const bestForYouBecause =
    tool.matchedCategories.length >= 2
      ? `Best because you need ${tool.matchedCategories.join(" + ")} and this tool supports both.`
      : tool.matchedCategories.length === 1
      ? `Best because you need ${tool.matchedCategories[0]} and this tool is strong in that area.`
      : "Best because this tool is a strong overall fit for your request.";

  return (
    <div className="h-full rounded-3xl border border-white/10 bg-slate-900/90 p-6 shadow-xl">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <span className={`rounded-full px-3 py-1 text-sm font-medium ${labelClass}`}>{label}</span>
          <h3 className="mt-3 text-2xl font-bold text-white">{tool.name}</h3>
          <p className="mt-2 max-w-3xl text-slate-300">{tool.bestFor}</p>
        </div>
        <div className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-sm text-emerald-200">
          Match score: {tool.score}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        {tool.beginner && <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-200">Beginner friendly</span>}
        {tool.powerUser && <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-200">Power user</span>}
        {tool.freeTier && <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-200">Free tier</span>}
        {tool.matchedCategories.map((category) => (
          <span key={category} className="rounded-full border border-fuchsia-400/30 bg-fuchsia-400/10 px-3 py-1 text-xs text-fuchsia-200">
            {category}
          </span>
        ))}
        <a
          href={tool.url}
          target="_blank"
          rel="noreferrer"
          className="ml-auto rounded-full bg-cyan-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-400"
        >
          Open Tool
        </a>
      </div>

      <div className="mt-6 grid items-stretch gap-4 md:grid-cols-3">
        <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Best for you because</p>
          <p className="mt-3 flex-1 text-sm text-slate-200">{bestForYouBecause}</p>
        </div>

        <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Strengths</p>
          <ul className="mt-3 flex-1 space-y-2 text-sm text-slate-200">
            {tool.strengths.map((strength) => (
              <li key={strength}>• {strength}</li>
            ))}
          </ul>
        </div>

        <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Watch out for</p>
          <p className="mt-3 flex-1 text-sm text-slate-200">{tool.limitations}</p>
        </div>
      </div>
    </div>
  );
}

export default function AIToolRecommender() {
  const [input, setInput] = useState("");
  const [submittedInput, setSubmittedInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [preferences, setPreferences] = useState<Preferences>({
    freeOnly: false,
    beginnerOnly: false,
    businessFocus: false,
    creativeFocus: false,
    fastestOption: false,
  });

  const categories = useMemo(() => {
    if (!submittedInput.trim()) return [] as string[];
    return classifyTask(submittedInput);
  }, [submittedInput]);

  const results = useMemo<RankedTool[]>(() => {
    if (!submittedInput.trim()) return [];

    return tools
      .map((tool) => {
        const { score, reasons } = scoreTool(tool, categories, submittedInput.toLowerCase(), preferences);
        return {
          ...tool,
          score,
          reasons,
          matchedCategories: categories.filter((category) => tool.categories.includes(category)),
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }, [categories, submittedInput, preferences]);

  const hasResults = submittedInput.trim().length > 0;
  const trimmedLower = submittedInput.trim().toLowerCase();
  const isVagueQuery = submittedInput.trim().length > 0 && (submittedInput.trim().length < 18 || ["help me", "help", "best tool", "ai tool"].includes(trimmedLower));
  const hasConflictingPrefs = preferences.freeOnly && preferences.creativeFocus && preferences.beginnerOnly;

  useEffect(() => {
    const savedQuery = window.sessionStorage.getItem("aiToolLastQuery");
    const savedPrefs = window.sessionStorage.getItem("aiToolPrefs");

    if (savedQuery) {
      setInput(savedQuery);
      setSubmittedInput(savedQuery);
    }

    if (savedPrefs) {
      try {
        setPreferences(JSON.parse(savedPrefs) as Preferences);
      } catch {
        // ignore invalid session state
      }
    }
  }, []);

  useEffect(() => {
    window.sessionStorage.setItem("aiToolLastQuery", input);
  }, [input]);

  useEffect(() => {
    window.sessionStorage.setItem("aiToolPrefs", JSON.stringify(preferences));
  }, [preferences]);

  const handleSubmit = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    setIsAnalyzing(true);
    await new Promise((resolve) => setTimeout(resolve, 450));
    setSubmittedInput(trimmed);
    setHistory((prev) => [trimmed, ...prev.filter((item) => item !== trimmed)].slice(0, 5));
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-white md:p-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">AI Task Recommender</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight md:text-5xl">Find the Best AI Tool</h1>
          <p className="mt-3 max-w-2xl text-base text-slate-300">Describe your task, apply filters, and get the best AI tools for the job.</p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl">
          <div className="mb-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Filters</p>
            <div className="flex flex-wrap gap-3">
              {preferenceOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() =>
                    setPreferences((prev) => ({
                      ...prev,
                      [option.id]: !prev[option.id],
                    }))
                  }
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                    preferences[option.id]
                      ? "border-cyan-400 bg-cyan-400/15 text-cyan-200"
                      : "border-white/10 bg-slate-900 text-slate-200 hover:border-cyan-400"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Describe your task</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void handleSubmit();
              }
            }}
            placeholder="Example: I need to make a presentation from my notes and want something beginner-friendly."
            className="min-h-[160px] w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-4 text-base text-white outline-none placeholder:text-slate-500 focus:border-cyan-400"
          />

          <button
            onClick={() => {
              void handleSubmit();
            }}
            disabled={isAnalyzing}
            className="mt-4 w-full rounded-2xl bg-cyan-500 px-4 py-3 text-base font-semibold text-white transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isAnalyzing ? "Analyzing…" : "Find Best Tool"}
          </button>

          <div className="mt-4 flex flex-wrap gap-3">
            {examples.map((example) => (
              <button
                key={example}
                onClick={() => setInput(example)}
                className="rounded-full border border-white/10 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-cyan-400 hover:text-white"
              >
                {example}
              </button>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-slate-900/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Detected task categories</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {hasResults &&
                categories.map((category) => (
                  <span key={category} className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-sm text-cyan-200">
                    {category}
                  </span>
                ))}
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-5">
          {history.length > 0 && (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Recent searches</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {history.map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      setInput(item);
                      setSubmittedInput(item);
                    }}
                    className="rounded-full border border-white/10 bg-slate-900 px-3 py-1 text-xs font-medium text-slate-200 hover:border-cyan-400"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          {hasResults && results[0] && (
            <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/5 p-6 shadow-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">Decision summary</p>
              <div className="mt-4 grid items-stretch gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Best match</p>
                  <p className="mt-2 text-lg font-semibold text-white">{results[0].name}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Why</p>
                  <p className="mt-2 text-sm text-slate-200">
                    {results[0].matchedCategories.length >= 2
                      ? `Best because you need ${results[0].matchedCategories.join(" + ")} and this tool supports both.`
                      : results[0].matchedCategories.length === 1
                      ? `Best because you need ${results[0].matchedCategories[0]} and this tool is strong in that area.`
                      : "Strong overall fit for your request."}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Best alternative</p>
                  <p className="mt-2 text-lg font-semibold text-white">{results[1]?.name || "No close alternative"}</p>
                </div>
              </div>
            </div>
          )}

          {hasResults ? (
            <>
              {isVagueQuery && (
                <div className="rounded-3xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-200">
                  Here are the best general-purpose tools for your request. Add more detail for sharper recommendations.
                </div>
              )}

              {hasConflictingPrefs && (
                <div className="rounded-3xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-200">
                  Your filters are pretty strict together. Try relaxing one to get more tailored results.
                </div>
              )}

              {results[0] && <ResultCard label="Best Overall" labelClass="bg-cyan-400/15 text-cyan-200" tool={results[0]} />}

              <div className="grid items-stretch gap-5 md:grid-cols-2">
                {results[1] && <ResultCard label="Best Alternative" labelClass="bg-emerald-400/15 text-emerald-200" tool={results[1]} />}
                {results[2] && <ResultCard label="Also Consider" labelClass="bg-amber-400/15 text-amber-200" tool={results[2]} />}
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Refine your task</p>
                <p className="mt-3 text-sm text-slate-300">Want better results? Try adding budget, experience level, or the output type you want.</p>
              </div>
            </>
          ) : (
            <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-10 text-center text-slate-400">
              <p className="text-base text-slate-300">Try: “Summarize a PDF and turn it into slides”</p>
              <p className="mt-2 text-sm">Try: “Fix bugs in my Python code”</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
