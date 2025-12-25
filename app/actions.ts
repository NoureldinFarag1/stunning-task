"use server";

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "dummy", // Prevent crash if missing, we handle it below
});

export async function generateWebsitePrompt(idea: string) {
  // If no API key is set, fall back to the smart regex logic
  if (!process.env.OPENAI_API_KEY) {
    console.log("No OpenAI API key found, using fallback logic");
    // Simulate a small network delay to make it feel like a real request
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return generateFallbackPrompt(idea);
  }

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an expert developer and architect. Your task is to take a rough website idea and convert it into a professional, detailed prompt that can be used with AI coding assistants (like Cursor, GitHub Copilot, or ChatGPT) to build the actual project.
          
          Structure the output in Markdown with these sections:
          # Project Blueprint: Ready to Build
          ## Original Idea
          ## Refined Concept
          ## Suggested Tech Stack (Be specific: e.g., Next.js 14, Tailwind, Supabase)
          ## Recommended Pages
          ## Key Features
          ## Design Direction
          ## Next Steps
          
          Keep it concise but actionable. Use bullet points.`
        },
        { role: "user", content: idea },
      ],
      model: "gpt-4o-mini",
    });

    return completion.choices[0].message.content || generateFallbackPrompt(idea);
  } catch (error) {
    console.error("OpenAI API Error:", error);
    return generateFallbackPrompt(idea);
  }
}

export async function refineBlueprint(currentBlueprint: string, refinementRequest: string) {
  // If no API key is set, fall back to a simple append logic
  if (!process.env.OPENAI_API_KEY) {
    console.log("No OpenAI API key found, using fallback logic for refinement");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Simple fallback: Append the request as a note
    return `${currentBlueprint}\n\n---\n\n## Refinement Note\n*User requested: ${refinementRequest}*\n\n(Note: To get actual AI refinements, please configure an OpenAI API Key)`;
  }

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an expert developer and architect. Your task is to update an existing project blueprint based on the user's refinement request.
          
          You will receive the current blueprint and a request (e.g., "Change database to MongoDB" or "Add a mobile app section").
          
          Return the FULLY UPDATED blueprint in Markdown. Maintain the existing structure but modify the relevant sections to reflect the user's request.
          
          Do not add conversational filler like "Here is the updated blueprint". Just return the markdown.`
        },
        { role: "user", content: `Current Blueprint:\n${currentBlueprint}\n\nRefinement Request: ${refinementRequest}` },
      ],
      model: "gpt-4o-mini",
    });

    return completion.choices[0].message.content || currentBlueprint;
  } catch (error) {
    console.error("OpenAI API Error:", error);
    return currentBlueprint;
  }
}

function generateFallbackPrompt(rawIdea: string): string {
  const idea = rawIdea.trim();
  
  // 1. Detect explicit tech preferences
  const hasPython = /python|django|flask|fastapi/i.test(idea);
  const hasNode = /node|express|nest/i.test(idea);
  const hasVue = /vue|nuxt/i.test(idea);
  const hasSvelte = /svelte|kit/i.test(idea);
  const hasMobile = /mobile|app|ios|android/i.test(idea) && !/web app/i.test(idea);
  const hasGo = /golang|go/i.test(idea);
  const hasPhp = /php|laravel/i.test(idea);

  // 2. Detect Project Type
  const hasEcommerce = /shop|store|sell|buy|product|cart|checkout|payment/i.test(idea);
  const hasSaas = /saas|platform|dashboard|subscription|users|crm|b2b/i.test(idea);
  const hasPortfolio = /portfolio|personal|resume|cv|showcase|work|photographer|designer/i.test(idea);
  const hasBlog = /blog|article|post|content|write|publish|news|magazine/i.test(idea);
  const hasLanding = /landing|launch|waitlist|coming soon|signup|promo/i.test(idea);
  
  // 3. Determine Stack & Features based on "Best Fit" logic
  let techStack = "Next.js, Tailwind CSS, Shadcn UI, Vercel"; // Default modern web
  let suggestedPages = ["Home", "About", "Contact"];
  let keyFeatures = [
    "Responsive design that works on all devices",
    "Fast loading with optimized performance",
    "SEO-friendly structure",
    "Accessible to all users (WCAG compliant)",
  ];

  // Override if explicit tech found
  if (hasPython) {
    techStack = "Django or FastAPI (Backend), React/Next.js (Frontend), PostgreSQL, Docker";
  } else if (hasVue) {
    techStack = "Nuxt.js, Tailwind CSS, Pinia, Vercel";
  } else if (hasSvelte) {
    techStack = "SvelteKit, Tailwind CSS, Vercel";
  } else if (hasGo) {
    techStack = "Go (Gin/Echo), React (Frontend), PostgreSQL";
  } else if (hasPhp) {
    techStack = "Laravel, Blade Templates (or Vue.js), MySQL, Tailwind CSS";
  } else if (hasMobile) {
    techStack = "React Native (Expo), TypeScript, Supabase, NativeWind";
    suggestedPages = ["Onboarding", "Home Feed", "Profile", "Settings", "Notifications"];
    keyFeatures = [
      "Push notifications integration",
      "Offline mode support",
      "Native gestures and animations",
      "Camera/Photo library access",
      "App Store compliant UI",
    ];
  }
  
  // If no explicit tech, use "Best Fit" based on type
  else if (hasEcommerce) {
    techStack = "Next.js, Tailwind CSS, Shopify Storefront API (or Stripe), Vercel";
    suggestedPages = ["Home", "Shop Grid", "Product Details", "Cart", "Checkout", "Order Status"];
    keyFeatures = [
      "Product catalog with filtering and search",
      "Secure checkout integration",
      "User accounts with order history",
      "Real-time inventory management",
      "Mobile-optimized shopping experience",
    ];
  } else if (hasSaas) {
    techStack = "Next.js, tRPC, Prisma, PostgreSQL, Tailwind CSS, NextAuth";
    suggestedPages = ["Landing", "Dashboard", "Settings", "Billing", "Profile", "Onboarding"];
    keyFeatures = [
      "Secure authentication (Social + Email)",
      "Interactive dashboard with data visualization",
      "Subscription/billing management (Stripe)",
      "Role-based access control",
      "API endpoints for external integration",
    ];
  } else if (hasPortfolio) {
    techStack = "Astro, Tailwind CSS, Framer Motion, Vercel";
    suggestedPages = ["Home", "Projects/Work", "About", "Resume", "Contact"];
    keyFeatures = [
      "High-performance static rendering",
      "Smooth page transitions",
      "Project showcase with case studies",
      "Contact form with email integration",
      "Optimized image galleries",
    ];
  } else if (hasBlog) {
    techStack = "Astro, Tailwind CSS, MDX, Vercel";
    suggestedPages = ["Home", "Blog Index", "Post Layout", "Tags/Categories", "About", "Newsletter"];
    keyFeatures = [
      "Markdown/MDX content management",
      "Category and tag filtering system",
      "Full-text search functionality",
      "Newsletter subscription form",
      "SEO meta tags and Open Graph support",
    ];
  } else if (hasLanding) {
    techStack = "React (Vite), Tailwind CSS, Framer Motion";
    suggestedPages = ["Single-page Landing"];
    keyFeatures = [
      "High-conversion Hero section",
      "Feature highlights with icons",
      "Social proof (testimonials/logos)",
      "Email capture for waitlist",
      "FAQ accordion section",
    ];
  }

  return `# Project Blueprint: Ready to Build

## Original Idea
"${idea}"

---

## Refined Concept

**What it is:**
A modern, professional website that ${idea.toLowerCase().includes("website") ? idea.toLowerCase().replace(/website|site|page/gi, "").trim() : idea.toLowerCase()}. Built with performance, accessibility, and user experience as top priorities.

**Target audience:**
Define your primary users — their needs, pain points, and what success looks like for them.

---

## Suggested Tech Stack
${techStack}

---

## Recommended Pages
${suggestedPages.map((page, i) => `${i + 1}. **${page}**`).join("\n")}

---

## Key Features
${keyFeatures.map((f) => `• ${f}`).join("\n")}

---

## Design Direction
• **Style:** Clean, minimal, modern
• **Colors:** Consider a primary brand color + neutral palette
• **Typography:** Sans-serif for UI, optional serif for headings
• **Spacing:** Generous whitespace for readability

---

## Next Steps
1. Wireframe the key pages
2. Set up the project with the suggested stack
3. Build mobile-first, then scale up
4. Add analytics and monitoring
5. Test with real users before launch

---

*Use this blueprint to start building!*`;
}
