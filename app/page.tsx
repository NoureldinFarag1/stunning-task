"use client";

import { useState, useRef, useEffect } from "react";
import { generateWebsitePrompt, refineBlueprint } from "./actions";
import { useHistory } from "./hooks/useHistory";
import { useTheme } from "./hooks/useTheme";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { InputForm } from "./components/InputForm";
import { BlueprintRenderer } from "./components/BlueprintRenderer";

export default function Home() {
  // Custom Hooks
  const { history, addToHistory, deleteHistoryItem } = useHistory();
  const { theme, toggleTheme } = useTheme();

  // Local State
  const [idea, setIdea] = useState("");
  const [improvedIdea, setImprovedIdea] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Refs for streaming effect
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isTypingRef = useRef(false);

  // Mobile check
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) setIsSidebarOpen(false);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Handlers
  const startNewChat = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      isTypingRef.current = false;
    }
    setIdea("");
    setImprovedIdea("");
    setCopied(false);
    if (isMobile) setIsSidebarOpen(false);
  };

  const handleHistorySelect = (item: { idea: string; prompt: string }) => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      isTypingRef.current = false;
    }
    setIdea(item.idea);
    setImprovedIdea(item.prompt);
    if (isMobile) setIsSidebarOpen(false);
  };

  const handleDeleteHistoryItem = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteHistoryItem(id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim()) return;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      isTypingRef.current = false;
    }

    setIsLoading(true);
    setImprovedIdea("");

    try {
      const improved = await generateWebsitePrompt(idea);
      addToHistory(idea, improved);
      setIsLoading(false);

      // Streaming effect
      isTypingRef.current = true;
      let currentIndex = 0;
      const speed = 5;

      const typeNextChar = () => {
        if (!isTypingRef.current) return;
        if (currentIndex < improved.length) {
          setImprovedIdea(improved.slice(0, currentIndex + 1));
          currentIndex++;
          typingTimeoutRef.current = setTimeout(typeNextChar, speed);
        } else {
          isTypingRef.current = false;
        }
      };
      typeNextChar();
    } catch (error) {
      console.error("Generation failed", error);
      setIsLoading(false);
    }
  };

  const handleRefine = async (request: string) => {
    setIsRefining(true);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      isTypingRef.current = false;
    }

    try {
      const refined = await refineBlueprint(improvedIdea, request);
      setImprovedIdea(refined);
    } catch (error) {
      console.error("Refinement failed", error);
    } finally {
      setIsRefining(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(improvedIdea);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([improvedIdea], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "project-blueprint.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex min-h-screen bg-zinc-50 text-zinc-900 transition-colors duration-300 dark:bg-black dark:text-zinc-100">
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        history={history}
        onLoadItem={handleHistorySelect}
        onDeleteItem={handleDeleteHistoryItem}
        onNewChat={startNewChat}
      />

      <main className="flex-1 transition-all duration-300">
        <Header
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          theme={theme}
          toggleTheme={toggleTheme}
        />

        <div className="mx-auto max-w-4xl px-6 pb-24 pt-12">
          <Hero />

          <InputForm
            idea={idea}
            setIdea={setIdea}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            onClear={() => setIdea("")}
            hasResult={!!improvedIdea}
          />

          <BlueprintRenderer
            content={improvedIdea}
            onCopy={handleCopy}
            onDownload={handleDownload}
            copied={copied}
            onRefine={handleRefine}
            isRefining={isRefining}
          />
        </div>
      </main>
    </div>
  );
}
