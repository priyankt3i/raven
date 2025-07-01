import React from 'react';
import { Task, Category, Status } from '../types';
import { useCountdown } from '../hooks/useCountdown';
import { motion } from 'framer-motion';
import { 
    CheckIcon, ArrowUturnLeftIcon, PencilIcon, ClockIcon,
    BriefcaseIcon, HomeIcon, UserIcon 
} from './icons/Icons';

interface TaskItemProps {
  task: Task;
  onComplete?: (id: string) => void;
  onUnplan?: (id: string) => void;
  onEdit: (task: Task) => void;
  isCompleted?: boolean;
  isUnplanned?: boolean;
}

const categoryIcon = {
    [Category.Work]: <BriefcaseIcon className="task-item-category-icon" />,
    [Category.Home]: <HomeIcon className="task-item-category-icon" />,
    [Category.Personal]: <UserIcon className="task-item-category-icon" />,
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onComplete, onUnplan, onEdit, isCompleted, isUnplanned }) => {
  const timeLeft = useCountdown(task.dueDate);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: { offset: { x: number; y: number }, velocity: { x: number; y: number }}) => {
    const swipeThreshold = 100;
    if (info.offset.x > swipeThreshold && onComplete) {
      onComplete(task.id);
    } else if (info.offset.x < -swipeThreshold && onUnplan) {
      onUnplan(task.id);
    }
  };

  const actionText = isUnplanned ? "Restore" : "Complete";
  const actionIcon = isUnplanned ? <ArrowUturnLeftIcon className="w-5 h-5" /> : <CheckIcon className="w-5 h-5" />;
  const unplanText = isUnplanned ? "To Do" : "Unplan";

  const isDraggable = !isCompleted;

  return (
    <div className="relative">
      {isDraggable && (
        <motion.div
            className="task-item-drag-background"
        >
            <div className="task-item-drag-background-left">
                {actionIcon}
                <span className="task-item-action-text">{actionText}</span>
            </div>
            <div className="task-item-drag-background-right">
                <span className="task-item-action-text">{unplanText}</span>
                <ArrowUturnLeftIcon className="task-item-action-icon" />
            </div>
        </motion.div>
      )}

      <motion.div
        drag={isDraggable ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        className={`task-item-main ${isDraggable ? 'draggable' : ''}`}
      >
        <div className="task-item-category-icon-container">
            {categoryIcon[task.category]}
        </div>
        <div className="task-item-content">
          <p className={`task-item-title ${isCompleted ? 'completed' : ''}`}>{task.title}</p>
          <div className="task-item-meta">
            <span className="task-item-category-badge">{task.category}</span>
            {!isCompleted && task.status !== Status.Unplanned && (
              <div className="task-item-time-left-container">
                  <ClockIcon className="task-item-time-left-icon" />
                  <span>{timeLeft}</span>
              </div>
            )}
            {isCompleted && task.completedAt && (
                <span className="task-item-completed-at">Completed: {new Date(task.completedAt).toLocaleTimeString()}</span>
            )}
          </div>
        </div>
        <button onClick={() => onEdit(task)} className="task-item-edit-button">
            <PencilIcon className="task-item-edit-button-icon" />
        </button>
      </motion.div>
    </div>
  );
};

export default TaskItem;
