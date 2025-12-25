import { useState, useEffect } from "react";

const generatePrompt = () => {
  const types = [
    "SaaS dashboard",
    "e-commerce store",
    "portfolio site",
    "blog",
    "landing page",
    "mobile app",
    "marketplace",
    "social network",
  ];
  const topics = [
    "tracking fitness goals",
    "selling handmade candles",
    "showcasing UX design",
    "sustainable living",
    "finding local coffee shops",
    "learning new languages",
    "managing personal finance",
    "sharing family recipes",
    "booking photography sessions",
  ];
  const styles = [
    "minimalist",
    "modern",
    "retro",
    "dark-mode",
    "colorful",
    "typography-focused",
  ];

  const type = types[Math.floor(Math.random() * types.length)];
  const topic = topics[Math.floor(Math.random() * topics.length)];
  const style = styles[Math.floor(Math.random() * styles.length)];

  const article = ["a", "e", "i", "o", "u"].includes(style[0]) ? "An" : "A";

  return `${article} ${style} ${type} for ${topic}...`;
};

export function useTypingEffect() {
  const [placeholder, setPlaceholder] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(50);
  const [currentExample, setCurrentExample] = useState(() => generatePrompt());

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isDeleting) {
      if (placeholder.length > 0) {
        timer = setTimeout(() => {
          setPlaceholder((prev) => prev.slice(0, -1));
          setTypingSpeed(30);
        }, typingSpeed);
      } else {
        // Finished deleting, now switch to typing a new prompt
        timer = setTimeout(() => {
          setIsDeleting(false);
          setCurrentExample(generatePrompt());
          setTypingSpeed(50);
        });
      }
    } else {
      // Typing
      if (placeholder !== currentExample) {
        timer = setTimeout(() => {
          setPlaceholder((prev) => currentExample.slice(0, prev.length + 1));
          setTypingSpeed(50);
        }, typingSpeed);
      } else {
        // Finished typing, wait then start deleting
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 2000);
      }
    }

    return () => clearTimeout(timer);
  }, [placeholder, isDeleting, typingSpeed, currentExample]);

  return placeholder;
}
