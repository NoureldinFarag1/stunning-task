import { useState } from "react";

interface BlueprintRendererProps {
  content: string;
  onCopy: () => void;
  onDownload: () => void;
  copied: boolean;
  onRefine: (request: string) => void;
  isRefining: boolean;
}

export function BlueprintRenderer({
  content,
  onCopy,
  onDownload,
  copied,
  onRefine,
  isRefining,
}: BlueprintRendererProps) {
  const [refinementRequest, setRefinementRequest] = useState("");

  const handleRefineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refinementRequest.trim()) return;
    onRefine(refinementRequest);
    setRefinementRequest("");
  };

  const parseSections = (text: string) => {
    const lines = text.split("\n");
    const sections: { title: string; level: number; content: string[] }[] = [];
    let currentSection: { title: string; level: number; content: string[] } | null =
      null;

    lines.forEach((line) => {
      if (line.startsWith("# ")) {
        if (currentSection) sections.push(currentSection);
        currentSection = { title: line.replace("# ", ""), level: 1, content: [] };
      } else if (line.startsWith("## ")) {
        if (currentSection) sections.push(currentSection);
        currentSection = { title: line.replace("## ", ""), level: 2, content: [] };
      } else {
        if (currentSection) {
          currentSection.content.push(line);
        } else {
          if (line.trim()) {
            if (!currentSection) {
              currentSection = { title: "", level: 0, content: [] };
            }
            currentSection.content.push(line);
          }
        }
      }
    });
    if (currentSection) sections.push(currentSection);
    return sections;
  };

  const renderLine = (line: string, i: number) => {
    if (line.startsWith("**") && line.endsWith("**")) {
      return (
        <p
          key={i}
          className="mb-1 mt-3 font-semibold text-zinc-800 dark:text-zinc-200"
        >
          {line.replace(/\*\*/g, "")}
        </p>
      );
    }
    if (line.startsWith("• ")) {
      return (
        <div
          key={i}
          className="mb-1.5 flex items-start gap-2 text-zinc-600 dark:text-zinc-400"
        >
          <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-violet-500" />
          <span>{line.replace("• ", "")}</span>
        </div>
      );
    }
    if (/^\d+\.\s\*\*/.test(line)) {
      return (
        <p key={i} className="mb-1 text-zinc-700 dark:text-zinc-300">
          {line.replace(/\*\*/g, "")}
        </p>
      );
    }
    if (line.startsWith("---")) {
      return (
        <hr key={i} className="my-4 border-zinc-200 dark:border-zinc-700" />
      );
    }
    if (line.startsWith("*") && line.endsWith("*") && !line.startsWith("**")) {
      return (
        <p
          key={i}
          className="mt-4 text-sm italic text-zinc-500 dark:text-zinc-400"
        >
          {line.replace(/\*/g, "")}
        </p>
      );
    }
    if (line.startsWith('"') && line.endsWith('"')) {
      return (
        <p
          key={i}
          className="rounded-lg bg-zinc-100 p-3 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
        >
          {line}
        </p>
      );
    }
    if (line.trim()) {
      return (
        <p key={i} className="mb-2 text-zinc-600 dark:text-zinc-400">
          {line}
        </p>
      );
    }
    return null;
  };

  return (
    <div
      className={`mt-8 transition-all duration-500 ${
        content
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0 hidden"
      }`}
    >
      {content && (
        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-100 bg-gradient-to-r from-violet-50 to-fuchsia-50 px-6 py-4 dark:border-zinc-800 dark:from-violet-950/50 dark:to-fuchsia-950/50">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                  Your Project Blueprint
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Your step-by-step guide to building this project
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={onDownload}
                className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm ring-1 ring-zinc-200 transition-all hover:bg-zinc-50 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700 dark:hover:bg-zinc-700"
                title="Download as Markdown"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                <span className="hidden sm:inline">Download</span>
              </button>
              <button
                onClick={onCopy}
                className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm ring-1 ring-zinc-200 transition-all hover:bg-zinc-50 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700 dark:hover:bg-zinc-700"
              >
                {copied ? (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-green-500"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2v2" />
                    </svg>
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="max-h-[600px] overflow-y-auto p-6">
            <div className="prose prose-zinc max-w-none dark:prose-invert prose-headings:font-semibold prose-h1:text-2xl prose-h2:mt-6 prose-h2:text-lg prose-p:leading-relaxed prose-li:leading-relaxed">
              {parseSections(content).map((section, i) => {
                const isTechStack = section.title
                  .toLowerCase()
                  .includes("tech stack");

                if (isTechStack) {
                  return (
                    <details
                      key={i}
                      className="group mb-6 rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50"
                      open
                    >
                      <summary className="flex cursor-pointer items-center justify-between font-semibold text-violet-600 dark:text-violet-400 list-none [&::-webkit-details-marker]:hidden">
                        <h2 className="text-base font-semibold inherit m-0">
                          {section.title}
                        </h2>
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
                          className="transition-transform duration-200 group-open:rotate-180"
                        >
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      </summary>
                      <div className="mt-4">
                        {section.content.map((line, j) => renderLine(line, j))}
                      </div>
                    </details>
                  );
                }

                return (
                  <div key={i} className="mb-8">
                    {section.title && (
                      <h2 className="mb-4 text-xl font-bold text-zinc-900 dark:text-zinc-100">
                        {section.title}
                      </h2>
                    )}
                    {section.content.map((line, j) => renderLine(line, j))}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-zinc-100 bg-zinc-50 px-6 py-3 dark:border-zinc-800 dark:bg-zinc-900/50">
            <p className="text-center text-xs text-zinc-500 dark:text-zinc-400">
              💡 Use this blueprint with any AI assistant to start building
            </p>
          </div>

          {/* Refinement Section */}
          <div className="border-t border-zinc-100 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <form onSubmit={handleRefineSubmit} className="relative">
              <input
                type="text"
                value={refinementRequest}
                onChange={(e) => setRefinementRequest(e.target.value)}
                placeholder="Ask for changes (e.g., 'Change database to MongoDB' or 'Add a mobile app section')..."
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3 pl-4 pr-12 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-400/10 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500"
                disabled={isRefining}
              />
              <button
                type="submit"
                disabled={!refinementRequest.trim() || isRefining}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-violet-600 hover:bg-violet-50 disabled:opacity-50 dark:text-violet-400 dark:hover:bg-violet-900/20"
              >
                {isRefining ? (
                  <svg
                    className="h-5 w-5 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
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
                ) : (
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
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
