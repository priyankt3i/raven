# Raven: Your Intelligent Daily Task Tracker

## Overview

Raven is a sleek, intuitive, and intelligent daily task management application designed to help you stay organized and productive. It allows you to effortlessly track your daily tasks, monitor your progress, and gain insights into your productivity with a clean, user-friendly interface. With features like AI-powered suggestions and a comprehensive dashboard, Raven aims to simplify your daily planning and help you focus on what truly matters.

## Features

-   **Intuitive Task Management**: Easily add, update, and manage your daily tasks.
-   **Drag-and-Drop Actions**: Quickly complete or unplan tasks with a simple swipe gesture.
-   **AI-Powered Suggestions**: Get smart suggestions for task categories and subtasks to streamline your planning (powered by Gemini API).
-   **Productivity Dashboard**: Visualize your completion rates, on-time performance, and tasks by category with interactive charts.
-   **Weekly AI Summary**: Generate a concise summary of your recent productivity trends.
-   **User Authentication**: Securely log in and manage your account.
-   **Theme Toggle**: Switch between light and dark modes for a personalized experience.
-   **Centralized Styling**: All application styles are consolidated into a single CSS file for maintainability and consistency.

## Technologies Used

-   **React**: A JavaScript library for building user interfaces.
-   **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript.
-   **Framer Motion**: A production-ready motion library for React.
-   **Recharts**: A composable charting library built on React components.
-   **Vite**: A fast frontend build tool.
-   **Gemini API**: For AI-powered task suggestions and weekly summaries.

## Getting Started

### Prerequisites

-   Node.js (LTS version recommended)
-   A Google Cloud Project with the Gemini API enabled and an API Key.

### Installation and Local Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/raven.git
    cd raven
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Gemini API Key:**
    Create a `.env.local` file in the root of the project and add your Gemini API key:
    ```
    VITE_GEMINI_API_KEY=YOUR_GEMINI_API_KEY
    ```
    Replace `YOUR_GEMINI_API_KEY` with your actual API key.

4.  **Run the application:**
    ```bash
    npm run dev
    ```
    The application will be accessible at `http://localhost:5173` (or another port if 5173 is in use).

## Project Structure

```
.
├── public/
│   ├── favicon.ico
│   ├── fullRaven.png
│   └── raven.png
├── src/
│   ├── components/
│   │   ├── icons/
│   │   │   └── Icons.tsx
│   │   ├── AccountPage.tsx
│   │   ├── AuthPage.tsx
│   │   ├── BottomNav.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Header.tsx
│   │   ├── HelpPage.tsx
│   │   ├── LandingPage.tsx
│   │   ├── SettingsPage.tsx
│   │   ├── TaskForm.tsx
│   │   ├── TaskItem.tsx
│   │   └── TaskList.tsx
│   ├── hooks/
│   │   ├── useCountdown.ts
│   │   └── useTasks.ts
│   ├── services/
│   │   └── geminiService.ts
│   ├── App.tsx
│   ├── index.html
│   ├── index.tsx
│   ├── main.tsx
│   ├── types.ts
│   └── vite-env.d.ts
├── .gitignore
├── index.css
├── package.json
├── package-lock.json
├── README.md
├── tsconfig.json
└── vite.config.ts
```

## Styling

All application-wide styling has been consolidated into `index.css`. This approach ensures a single source of truth for visual styles, improving maintainability and consistency across the application. Tailwind CSS classes previously used inline within components have been extracted and converted into custom CSS rules in `index.css`.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any bugs or feature requests.

## License

This project is licensed under the MIT License.
