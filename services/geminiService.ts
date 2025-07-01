
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { AiSuggestions, Task, Category, Status } from "../types";

const API_KEY = process.env.API_KEY;
let ai: GoogleGenAI | null = null;

if (API_KEY) {
  try {
    ai = new GoogleGenAI({ apiKey: API_KEY });
  } catch (e) {
    console.error("Failed to initialize GoogleGenAI:", e);
    ai = null; // Ensure ai is null on failure
  }
} else {
  console.warn("Gemini API key not found. AI features will be disabled.");
}

function parseJsonResponse<T,>(jsonString: string): T | null {
    let cleanJsonString = jsonString.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = cleanJsonString.match(fenceRegex);
    if (match && match[2]) {
        cleanJsonString = match[2].trim();
    }

    try {
        return JSON.parse(cleanJsonString) as T;
    } catch (e) {
        console.error("Failed to parse JSON response:", e, "Raw string:", jsonString);
        return null;
    }
}


export const getAiSuggestions = async (taskTitle: string): Promise<AiSuggestions | null> => {
  if (!ai) return null;
  
  const prompt = `
    Analyze the task title and suggest a category and up to 3 relevant subtasks.
    Task: "${taskTitle}"
    Available categories: "Work", "Home", "Personal".
    Return a single, valid JSON object with the keys "category" (string) and "subtasks" (an array of strings).
    Example for "plan team offsite": {"category": "Work", "subtasks": ["Finalize budget", "Book venue", "Send invites"]}
    Example for "weekend cleaning": {"category": "Home", "subtasks": ["Vacuum floors", "Do laundry", "Wipe windows"]}
    Example for "prepare for marathon": {"category": "Personal", "subtasks": ["Go for a 10k run", "Meal prep for the week", "Stretch for 20 mins"]}
    `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-04-17",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });
    
    const text = response.text;
    const parsed = parseJsonResponse<{category: string; subtasks: string[]}>(text);
    
    if (parsed && Object.values(Category).includes(parsed.category as Category)) {
        return {
            category: parsed.category as Category,
            subtasks: parsed.subtasks || [],
        };
    }
    return null;

  } catch (error) {
    console.error("Error fetching AI suggestions:", error);
    return null;
  }
};


export const getWeeklySummary = async (tasks: Task[]): Promise<string> => {
    if (!ai) return "AI features are disabled as the API key is missing.";

    if (tasks.length === 0) {
        return "You didn't have any tasks in the last week. Add some tasks to get a summary next week!";
    }

    const taskSummary = tasks.map(t => 
        `- ${t.title} (Category: ${t.category}, Status: ${t.status}, Due: ${new Date(t.dueDate).toLocaleDateString()}, Completed On Time: ${t.status === Status.Completed && t.completedAt && new Date(t.completedAt) <= new Date(t.dueDate) ? 'Yes' : 'No'})`
    ).join('\n');

    const prompt = `
        You are a friendly and encouraging productivity coach. 
        Analyze the following list of tasks from the user's past week and provide a short, motivating summary in markdown format. 
        Highlight their accomplishments, mention completion rates, and maybe offer a gentle tip for improvement if you see a pattern (e.g., many late tasks in one category).
        Keep it concise and positive.

        Tasks:
        ${taskSummary}
    `;

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-04-17",
            contents: prompt,
            config: {
                temperature: 0.7
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error generating weekly summary:", error);
        return "There was an error generating your summary.";
    }
};
