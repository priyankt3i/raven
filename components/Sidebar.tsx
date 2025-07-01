import React from 'react';
import { motion } from 'framer-motion';
import { ChartPieIcon, CheckCircleIcon, ArchiveBoxIcon, ListBulletIcon, XMarkIcon } from './icons/Icons';

interface NavItem {
    id: string;
    label: string;
    icon: React.ComponentType<{ className: string }>;
    count: number;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeView: string;
  setActiveView: (view: any) => void;
  todayTaskCount: number;
  unplannedTaskCount: number;
  completedTaskCount: number;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, activeView, setActiveView, todayTaskCount, unplannedTaskCount, completedTaskCount }) => {
  const navItems: NavItem[] = [
      { id: 'today', label: 'Today', icon: ListBulletIcon, count: todayTaskCount },
      { id: 'unplanned', label: 'Unplanned', icon: ArchiveBoxIcon, count: unplannedTaskCount },
      { id: 'completed', label: 'Completed', icon: CheckCircleIcon, count: completedTaskCount },
      { id: 'dashboard', label: 'Dashboard', icon: ChartPieIcon, count: 0 },
  ];

  return (
    <>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="sidebar-overlay"
          onClick={onClose}
        />
      )}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: isOpen ? '0%' : '-100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="sidebar-container"
      >
        <div className="sidebar-header">
          <h2 className="sidebar-title">
            <img src="/public/fullRaven.png" alt="Raven Logo" className="landing-page-logo" />
          </h2>
          <button onClick={onClose} className="sidebar-close-button">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <nav className="sidebar-nav">
          {navItems.map(({ id, label, icon: Icon, count }) => (
            <button
              key={id}
              onClick={() => { setActiveView(id); onClose(); }}
              className={`sidebar-nav-item ${activeView === id ? 'active' : ''}`}
            >
              <Icon className="sidebar-nav-icon" />
              <span className="sidebar-nav-label">{label}</span>
              {count > 0 && (
                <span className="sidebar-nav-count-badge">
                    {count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </motion.div>
    </>
  );
};

export default Sidebar;
