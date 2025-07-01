import React from 'react';
import { motion } from 'framer-motion';

interface NavItem {
    id: string;
    label: string;
    icon: React.ComponentType<{ className: string }>;
    count: number;
}

interface BottomNavProps {
  items: NavItem[];
  activeView: string;
  setActiveView: (view: any) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ items, activeView, setActiveView }) => {
  return (
    <nav className="bottom-nav-container">
      {items.map(({ id, label, icon: Icon, count }) => (
        <button
          key={id}
          onClick={() => setActiveView(id)}
          className={`bottom-nav-button ${activeView === id ? 'active' : ''}`}
        >
          {activeView === id && (
            <motion.div
              layoutId="active-pill"
              className="bottom-nav-active-pill"
              style={{ borderRadius: 12 }}
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            />
          )}
          <div className="bottom-nav-content">
            <Icon className="bottom-nav-icon" />
            <span className="bottom-nav-label">{label}</span>
            {count > 0 && (
                <span className="bottom-nav-count-badge">
                    {count}
                </span>
            )}
          </div>
        </button>
      ))}
    </nav>
  );
};

export default BottomNav;
