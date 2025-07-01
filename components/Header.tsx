import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from '../types';
import { 
    SunIcon, MoonIcon, LogoutIcon, EllipsisVerticalIcon,
    UserCircleIcon, Cog6ToothIcon, QuestionMarkCircleIcon, Bars3Icon
} from './icons/Icons';

interface HeaderProps {
  user: User;
  theme: string;
  onToggleTheme: () => void;
  onShowAccount: () => void;
  onShowSettings: () => void;
  onShowHelp: () => void;
  onLogout: () => void;
  onOpenSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, theme, onToggleTheme, onShowAccount, onShowSettings, onShowHelp, onLogout, onOpenSidebar }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  const greeting = user.firstName ? `Hi, ${user.firstName}` : "Welcome";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const menuItems = [
    { label: 'Account Details', icon: UserCircleIcon, action: onShowAccount },
    { label: `Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`, icon: theme === 'light' ? MoonIcon : SunIcon, action: onToggleTheme },
    { label: 'Settings', icon: Cog6ToothIcon, action: onShowSettings },
    { label: 'Help & FAQ', icon: QuestionMarkCircleIcon, action: onShowHelp },
    { label: 'Log Out', icon: LogoutIcon, action: onLogout },
  ];

  return (
    <header className="header-container">
      <button onClick={onOpenSidebar} className="header-menu-button" aria-label="Open sidebar">
        <Bars3Icon className="w-6 h-6" />
      </button>
      <div>
        <h1 className="header-title">
            Raven
        </h1>
        <p className="header-greeting">{greeting}</p>
      </div>

      <div ref={menuRef} className="relative">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="menu-button"
          aria-label="Open menu"
        >
          <EllipsisVerticalIcon className="w-6 h-6" />
        </button>
        <AnimatePresence>
            {isMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="dropdown-menu"
                >
                    <div className="py-1">
                        <div className="dropdown-menu-section-header">
                            <p className="dropdown-menu-section-title">Signed in as</p>
                            <p className="dropdown-menu-section-email">{user.email}</p>
                        </div>
                        {menuItems.map(({ label, icon: Icon, action }) => (
                            <button
                                key={label}
                                onClick={() => { action(); setIsMenuOpen(false); }}
                                className="dropdown-menu-item"
                            >
                                <Icon className="dropdown-menu-item-icon" />
                                {label}
                            </button>
                        ))}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
