import { useState, useEffect, useCallback } from 'react';
import { Task, Status } from '../types';

const TASKS_STORAGE_KEY = 'raven_planner_tasks';

const getInitialTasks = (): Task[] => {
    try {
        const item = window.localStorage.getItem(TASKS_STORAGE_KEY);
        return item ? JSON.parse(item) : [];
    } catch (error) {
        console.error("Error reading tasks from localStorage", error);
        return [];
    }
};

export const useTasks = () => {
    const [tasks, setTasks] = useState<Task[]>(getInitialTasks);

    useEffect(() => {
        try {
            window.localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
        } catch (error) {
            console.error("Error saving tasks to localStorage", error);
        }
    }, [tasks]);

    const addTask = useCallback((task: Task) => {
        setTasks(prevTasks => [task, ...prevTasks]);
    }, []);

    const updateTask = useCallback((updatedTask: Task) => {
        setTasks(prevTasks => prevTasks.map(task => task.id === updatedTask.id ? updatedTask : task));
    }, []);

    const moveTask = useCallback((id: string, newStatus: Status) => {
        setTasks(prevTasks => prevTasks.map(task => {
            if (task.id === id) {
                return { 
                    ...task, 
                    status: newStatus,
                    completedAt: newStatus === Status.Completed ? new Date().toISOString() : task.completedAt
                };
            }
            return task;
        }));
    }, []);

    return { tasks, addTask, updateTask, moveTask };
};