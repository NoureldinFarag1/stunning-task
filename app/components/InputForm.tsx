import { useTypingEffect } from "../hooks/useTypingEffect";

interface InputFormProps {
  idea: string;
  setIdea: (idea: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClear: () => void;
  isLoading: boolean;
  hasResult: boolean;
}

export function InputForm({
  idea,
  setIdea,
  onSubmit,
  onClear,
  isLoading,
  hasResult,
}: InputFormProps) {
  const placeholder = useTypingEffect();

  const inspirationTemplates = [
    {
      title: "Online Store",
      icon: "🛍️",
      prompt:
        "I want to start an online store selling handmade ceramic mugs. I need a homepage with featured products, a clean product grid, and a simple checkout process. The vibe should be cozy and earthy.",
    },
    {
      title: "Personal Portfolio",
      icon: "🎨",
      prompt:
        "A personal portfolio website to showcase my photography work. I want a full-screen gallery on the homepage, an 'About Me' section, and a contact form. Keep it dark and cinematic.",
    },
    {
      title: "SaaS Landing Page",
      icon: "🚀",
      prompt:
        "A landing page for a new AI writing assistant tool. It needs a catchy headline, a pricing section with 3 tiers, and a testimonials carousel. The design should be trustworthy and professional.",
    },
    {
      title: "Local Business",
      icon: "☕",
      prompt:
        "A website for a local coffee shop. We need a menu page, a location map, and an Instagram feed integration. The style should be modern and inviting.",
    },
  ];

  return (
    <section className="mx-auto max-w-3xl">
      {/* Inspiration Gallery */}
      {!hasResult && !idea && (
        <div className="mb-8 grid gap-3 sm:grid-cols-2">
          {inspirationTemplates.map((template) => (
            <button
              key={template.title}
              onClick={() => setIdea(template.prompt)}
              className="flex items-start gap-3 rounded-xl border border-zinc-200 bg-white p-4 text-left transition-all hover:border-violet-300 hover:bg-violet-50/50 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-violet-700 dark:hover:bg-violet-900/20"
            >
              <span className="text-2xl">{template.icon}</span>
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {template.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-xs text-zinc-500 dark:text-zinc-400">
                  {template.prompt}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSubmit(e);
              }
            }}
            placeholder={placeholder}
            rows={hasResult ? 2 : 4}
            className={`w-full resize-none rounded-2xl border border-zinc-200 bg-white p-5 text-base leading-relaxed text-zinc-900 placeholder:text-zinc-400 focus:border-violet-400 focus:outline-none focus:ring-4 focus:ring-violet-400/10 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-violet-500 dark:focus:ring-violet-500/10 transition-all ${
              hasResult ? "shadow-sm" : "shadow-xl"
            }`}
          />
          {idea && (
            <button
              type="button"
              onClick={onClear}
              className="absolute right-3 top-3 rounded-full p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
              aria-label="Clear input"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>

        {!hasResult && (
          <button
            type="submit"
            disabled={!idea.trim() || isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:shadow-xl hover:shadow-violet-500/30 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
          >
            {isLoading ? (
              <>
                <svg
                  className="h-5 w-5 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Generating your project blueprint...
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                </svg>
                Generate Project Blueprint
              </>
            )}
          </button>
        )}
      </form>
    </section>
  );
}
