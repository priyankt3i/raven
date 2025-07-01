import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Task, Category, Priority, Status } from '../types';
import { getAiSuggestions } from '../services/geminiService';
import { SparklesIcon } from './icons/Icons';

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  existingTask?: Task | null;
}

const TaskForm: React.FC<TaskFormProps> = ({ isOpen, onClose, onSave, existingTask }) => {
  const [task, setTask] = useState<Omit<Task, 'id' | 'status' | 'createdAt'>>({
    title: '',
    description: '',
    category: Category.Personal,
    dueDate: new Date(Date.now() + 60 * 60 * 1000).toISOString().substring(0, 16),
    priority: Priority.Medium,
  });
  const [suggestions, setSuggestions] = useState<{category: Category | null, subtasks: string[]}>({ category: null, subtasks: [] });
  const [isSuggesting, setIsSuggesting] = useState(false);

  useEffect(() => {
    if (existingTask) {
      setTask({
        title: existingTask.title,
        description: existingTask.description || '',
        category: existingTask.category,
        dueDate: new Date(existingTask.dueDate).toISOString().substring(0, 16),
        priority: existingTask.priority,
      });
    } else {
        // Reset form for new task
        setTask({
            title: '',
            description: '',
            category: Category.Personal,
            dueDate: new Date(Date.now() + 60 * 60 * 1000).toISOString().substring(0, 16),
            priority: Priority.Medium,
        });
    }
  }, [existingTask, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTask(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSuggestion = useCallback(async () => {
    if (task.title.length < 5) return;
    setIsSuggesting(true);
    try {
        const result = await getAiSuggestions(task.title);
        if (result) {
            setSuggestions(result);
        }
    } catch (error) {
        console.error("Failed to get AI suggestions:", error);
    } finally {
        setIsSuggesting(false);
    }
  }, [task.title]);

  useEffect(() => {
      const handler = setTimeout(() => {
          if (task.title && !existingTask) {
            handleSuggestion();
          }
      }, 1000);

      return () => {
          clearTimeout(handler);
      };
  }, [task.title, existingTask, handleSuggestion]);

  const applyCategorySuggestion = () => {
      if (suggestions.category) {
          setTask(prev => ({ ...prev, category: suggestions.category!}));
          setSuggestions(prev => ({ ...prev, category: null }));
      }
  };

  const applySubtaskSuggestion = (subtask: string) => {
    const subtaskToAdd = `- ${subtask}`;
    setTask(prev => ({
        ...prev,
        description: prev.description ? `${prev.description}\n${subtaskToAdd}` : subtaskToAdd,
    }));
    setSuggestions(prev => ({
        ...prev,
        subtasks: prev.subtasks.filter(s => s !== subtask),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (existingTask) {
      onSave({ ...existingTask, ...task });
    } else {
      onSave({
        id: crypto.randomUUID(),
        ...task,
        status: Status.Todo,
        createdAt: new Date().toISOString(),
      });
    }
    onClose();
  };

  return (
    <div
      className="task-form-overlay"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="task-form-content"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="task-form-title">{existingTask ? 'Edit Task' : 'New Task'}</h2>
        <form onSubmit={handleSubmit} className="task-form-form">
          <input type="text" name="title" value={task.title} onChange={handleChange} placeholder="Task Title" className="task-form-input" required />
          
          {isSuggesting && <div className="task-form-suggesting-text">AI is thinking...</div>}
          
          { (suggestions.category || suggestions.subtasks.length > 0) &&
            <div className="task-form-suggestions-container">
                <h3 className="task-form-suggestions-title"><SparklesIcon className="task-form-suggestions-icon" /> AI Suggestions</h3>
                <div className="task-form-suggestions-buttons">
                {suggestions.category && (
                    <button type="button" onClick={applyCategorySuggestion} className="task-form-suggestion-button">
                        Set Category: {suggestions.category}
                    </button>
                )}
                {suggestions.subtasks.map(sub => (
                    <button type="button" key={sub} onClick={() => applySubtaskSuggestion(sub)} className="task-form-suggestion-button">
                        + {sub}
                    </button>
                ))}
                </div>
            </div>
          }

          <textarea name="description" value={task.description} onChange={handleChange} placeholder="Description (optional)" className="task-form-input h-24" />
          <div className="task-form-grid">
            <select name="category" value={task.category} onChange={handleChange} className="task-form-input">
              {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <select name="priority" value={task.priority} onChange={handleChange} className="task-form-input">
              {Object.values(Priority).map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <input type="datetime-local" name="dueDate" value={task.dueDate} onChange={handleChange} className="task-form-input" />
          <div className="task-form-actions">
            <button type="button" onClick={onClose} className="task-form-cancel-button">Cancel</button>
            <button type="submit" className="task-form-submit-button">{existingTask ? 'Save Changes' : 'Add Task'}</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default TaskForm;
