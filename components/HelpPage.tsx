import React from 'react';
import { motion } from 'framer-motion';

interface HelpPageProps {
  onClose: () => void;
}

const HelpPage: React.FC<HelpPageProps> = ({ onClose }) => {
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
        <h2 className="task-form-title">Help & FAQ</h2> {/* Reusing task-form-title */}
         <p className="settings-page-info-text"> {/* Reusing settings-page-info-text */}
            A helpful FAQ and guide will be available here soon.
        </p>
        <div className="settings-page-button-container"> {/* Reusing settings-page-button-container */}
            <button type="button" onClick={onClose} className="settings-page-back-button">Back</button> {/* Reusing settings-page-back-button */}
        </div>
      </motion.div>
    </div>
  );
};

export default HelpPage;
