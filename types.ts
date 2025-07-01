
export enum Category {
  Work = "Work",
  Home = "Home",
  Personal = "Personal",
}

export enum Status {
  Todo = "Todo",
  Completed = "Completed",
  Unplanned = "Unplanned",
}

export enum Priority {
    Low = 'Low',
    Medium = 'Medium',
    High = 'High'
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: Category;
  dueDate: string;
  priority: Priority;
  status: Status;
  createdAt: string;
  completedAt?: string;
}

export interface User {
  email: string;
  firstName: string;
  lastName: string;
}

export interface AiSuggestions {
    category: Category;
    subtasks: string[];
}

declare module '*.css';
