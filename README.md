# Website Blueprint Generator

A powerful Next.js application that helps you generate detailed, professional website blueprints and prompts from simple ideas. Powered by AI, this tool transforms your rough concepts into structured development plans.

## 🌟 Features

- **AI-Powered Generation**: Convert simple website ideas into comprehensive blueprints.
- **Interactive Refinement**: Fine-tune your blueprints with follow-up requests to get exactly what you need.
- **History Management**: Automatically saves your generation history so you never lose an idea.
- **Smart Templates**: Built-in inspiration templates for common use cases (E-commerce, Portfolio, SaaS, etc.).
- **Dark/Light Mode**: Fully responsive interface with theme support.
- **Export Options**: Easily copy to clipboard or download your blueprints as files.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- An OpenAI API Key

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd stunning-task
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add your OpenAI API key:
   ```env
   OPENAI_API_KEY=your_api_key_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📖 How to Use

1. **Enter Your Idea**: 
   - Type a description of the website you want to build in the main input field.
   - Or, choose one of the "Inspiration" cards (e.g., Online Store, Portfolio) to get started quickly.

2. **Generate**: 
   - Click the submit button. The AI will process your request and stream a detailed blueprint.

3. **Review & Refine**:
   - Read through the generated blueprint.
   - If you want to make changes (e.g., "Add a blog section" or "Make the design more minimal"), use the **Refine** input at the bottom of the result view.

4. **Save & Export**:
   - Use the **Copy** button to copy the text to your clipboard.
   - Use the **Download** button to save the blueprint as a text file.
   - Access previous generations from the **History** sidebar on the left.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **AI Integration**: [OpenAI API](https://openai.com/)
- **State Management**: React Hooks (Custom hooks for History, Theme, etc.)

## 📂 Project Structure

```
app/
├── actions.ts              # Server actions for AI generation
├── components/             # React components
│   ├── BlueprintRenderer.tsx # Displays the generated content
│   ├── InputForm.tsx       # Main user input area
│   ├── Sidebar.tsx         # History navigation
│   └── ...
├── hooks/                  # Custom hooks
│   ├── useHistory.ts       # LocalStorage history management
│   └── ...
└── page.tsx                # Main application page
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
