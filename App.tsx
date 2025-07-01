import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTasks } from './hooks/useTasks';
import { Category, Status, Task, User } from './types';
import Header from './components/Header';
import TaskList from './components/TaskList';
import Dashboard from './components/Dashboard';
import TaskForm from './components/TaskForm';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import AccountPage from './components/AccountPage';
import SettingsPage from './components/SettingsPage';
import HelpPage from './components/HelpPage';
import Sidebar from './components/Sidebar';
import { PlusIcon, ChartPieIcon, CheckCircleIcon, ArchiveBoxIcon, ListBulletIcon, Bars3Icon } from './components/icons/Icons';

type View = 'today' | 'unplanned' | 'completed' | 'dashboard';
type AppView = 'landing' | 'auth' | 'app';
type ModalView = 'account' | 'settings' | 'help';


const APP_USER_KEY = 'raven_user';
const APP_THEME_KEY = 'raven_theme';

export default function App() {
  const { tasks, addTask, updateTask, moveTask } = useTasks();
  
  const [user, setUser] = useState<User | null>(() => {
    try {
        const storedUser = localStorage.getItem(APP_USER_KEY);
        return storedUser ? JSON.parse(storedUser) : null;
    } catch {
        return null;
    }
  });

  const [theme, setTheme] = useState(() => localStorage.getItem(APP_THEME_KEY) || 'light');
  
  const [currentView, setCurrentView] = useState<AppView>(user ? 'app' : 'landing');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  
  const [activeView, setActiveView] = useState<View>('today');
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [activeModal, setActiveModal] = useState<ModalView | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem(APP_THEME_KEY, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(APP_THEME_KEY, 'light');
    }
  }, [theme]);
  
  const handleShowAuth = (mode: 'login' | 'signup') => {
      setAuthMode(mode);
      setCurrentView('auth');
  };

  const handleAuthSuccess = (userData: User) => {
      localStorage.setItem(APP_USER_KEY, JSON.stringify(userData));
      setUser(userData);
      setCurrentView('app');
  };
  
  const handleLogout = () => {
      localStorage.removeItem(APP_USER_KEY);
      setUser(null);
      setActiveModal(null);
      setCurrentView('landing');
  };

  const handleUserUpdate = useCallback((updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem(APP_USER_KEY, JSON.stringify(updatedUser));
    setActiveModal(null);
  }, []);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const openAddTaskForm = () => {
    setEditingTask(null);
    setIsTaskFormOpen(true);
  };
  
  const openEditTaskForm = (task: Task) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };

  const handleTaskAction = (id: string, newStatus: Status) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
        moveTask(id, newStatus);
    }
  };

  const todayTasks = useMemo(() => tasks.filter(t => t.status === Status.Todo), [tasks]);
  const unplannedTasks = useMemo(() => tasks.filter(t => t.status === Status.Unplanned), [tasks]);
  const completedTasks = useMemo(() => tasks.filter(t => t.status === Status.Completed), [tasks]);
  
  // No longer needed as navItems are now defined within Sidebar
  // const navItems = [
  //     { id: 'today', label: 'Today', icon: ListBulletIcon, count: todayTasks.length },
  //     { id: 'unplanned', label: 'Unplanned', icon: ArchiveBoxIcon, count: unplannedTasks.length },
  //     { id: 'completed', label: 'Completed', icon: CheckCircleIcon, count: completedTasks.length },
  //     { id: 'dashboard', label: 'Dashboard', icon: ChartPieIcon, count: 0 },
  // ];

  const renderTaskView = () => {
    switch (activeView) {
      case 'today':
        return <TaskList tasks={todayTasks} onComplete={(id) => handleTaskAction(id, Status.Completed)} onUnplan={(id) => handleTaskAction(id, Status.Unplanned)} onEdit={openEditTaskForm} />;
      case 'unplanned':
        return <TaskList tasks={unplannedTasks} onComplete={(id) => handleTaskAction(id, Status.Completed)} onUnplan={(id) => handleTaskAction(id, Status.Todo)} onEdit={openEditTaskForm} isUnplanned />;
      case 'completed':
        return <TaskList tasks={completedTasks} onEdit={openEditTaskForm} isCompleted />;
      case 'dashboard':
        return <Dashboard tasks={tasks} />;
      default:
        return <TaskList tasks={todayTasks} onComplete={(id) => handleTaskAction(id, Status.Completed)} onUnplan={(id) => handleTaskAction(id, Status.Unplanned)} onEdit={openEditTaskForm} />;
    }
  };
  
  const renderAppContent = () => {
      if (currentView === 'landing') {
          return (
              <motion.div key="landing" exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }}>
                  <LandingPage onShowLogin={() => handleShowAuth('login')} onShowSignup={() => handleShowAuth('signup')} />
              </motion.div>
          );
      }
      if (currentView === 'auth') {
          return (
              <motion.div key="auth" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                  <AuthPage initialMode={authMode} onAuthSuccess={handleAuthSuccess} onBack={() => setCurrentView('landing')} />
              </motion.div>
          );
      }
      if (currentView === 'app' && user) {
          return (
              <motion.div
                  key="app"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="app-container-with-sidebar">
                    <Header
                      user={user}
                      theme={theme}
                      onToggleTheme={toggleTheme}
                      onShowAccount={() => setActiveModal('account')}
                      onShowSettings={() => setActiveModal('settings')}
                      onShowHelp={() => setActiveModal('help')}
                      onLogout={handleLogout}
                      onOpenSidebar={() => setIsSidebarOpen(true)}
                    />
                    
                    <main className="main-content">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeView}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                {renderTaskView()}
                            </motion.div>
                        </AnimatePresence>
                    </main>
                    
                    <div className="add-task-button-container">
                       <button
                         onClick={openAddTaskForm}
                         className="add-task-button"
                         aria-label="Add new task"
                       >
                        <PlusIcon className="w-8 h-8"/>
                       </button>
                    </div>

                    <AnimatePresence>
                        {isTaskFormOpen && (
                            <TaskForm 
                                isOpen={isTaskFormOpen} 
                                onClose={() => setIsTaskFormOpen(false)} 
                                onSave={editingTask ? updateTask : addTask}
                                existingTask={editingTask}
                            />
                        )}
                        {activeModal === 'account' && <AccountPage user={user} onSave={handleUserUpdate} onClose={() => setActiveModal(null)} />}
                        {activeModal === 'settings' && <SettingsPage onClose={() => setActiveModal(null)} />}
                        {activeModal === 'help' && <HelpPage onClose={() => setActiveModal(null)} />}
                    </AnimatePresence>
                  </div>
                  <Sidebar
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                    activeView={activeView}
                    setActiveView={setActiveView}
                    todayTaskCount={todayTasks.length}
                    unplannedTaskCount={unplannedTasks.length}
                    completedTaskCount={completedTasks.length}
                  />
                </motion.div>
          );
      }
      return null;
  };

  return (
    <div className="app-wrapper">
      <AnimatePresence mode="wait">
        {renderAppContent()}
      </AnimatePresence>
    </div>
  );
}
