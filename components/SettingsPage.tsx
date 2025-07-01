import React from 'react';
import { motion } from 'framer-motion';

interface SettingsPageProps {
  onClose: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ onClose }) => {
  return (
    <div
      className="task-form-overlay" /* Reusing task-form-overlay */
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="task-form-content" /* Reusing task-form-content */
        onClick={e => e.stopPropagation()}
      >
        <h2 className="task-form-title">Settings</h2> {/* Reusing task-form-title */}
        <p className="settings-page-info-text">
            Future application settings will live here.
        </p>
        <div className="settings-page-button-container">
            <button type="button" onClick={onClose} className="settings-page-back-button">Back</button>
        </div>
      </motion.div>
    </div>
  );
};

export default SettingsPage;
