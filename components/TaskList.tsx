import React from 'react';
import { Task, Status } from '../types';
import TaskItem from './TaskItem';
import { AnimatePresence, motion } from 'framer-motion';

interface TaskListProps {
  tasks: Task[];
  onComplete?: (id: string) => void;
  onUnplan?: (id: string) => void;
  onEdit: (task: Task) => void;
  isCompleted?: boolean;
  isUnplanned?: boolean;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onComplete, onUnplan, onEdit, isCompleted = false, isUnplanned = false }) => {
  if (tasks.length === 0) {
    return (
      <div className="task-list-empty-state">
        <p className="task-list-empty-state-text">
          {isCompleted ? "No completed tasks yet." : isUnplanned ? "No unplanned tasks." : "No tasks for today. Add one! ✨"}
        </p>
      </div>
    );
  }

  return (
    <div className="task-list-container">
       <AnimatePresence>
            {tasks.map((task) => (
                 <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -300, transition: { duration: 0.3 } }}
                    transition={{ type: 'spring', stiffness: 260, damping: 25 }}
                >
                    <TaskItem 
                        task={task} 
                        onComplete={onComplete} 
                        onUnplan={onUnplan} 
                        onEdit={onEdit} 
                        isCompleted={isCompleted}
                        isUnplanned={isUnplanned}
                    />
                </motion.div>
            ))}
        </AnimatePresence>
    </div>
  );
};

export default TaskList;
