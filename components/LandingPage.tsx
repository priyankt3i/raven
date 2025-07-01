import React from 'react';
import { motion } from 'framer-motion';

interface LandingPageProps {
  onShowLogin: () => void;
  onShowSignup: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onShowLogin, onShowSignup }) => {
  return (
    <div className="landing-page-container">
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="landing-page-content-wrapper"
        >
            <h1 className="mb-4">
            <img src="/public/fullRaven.png" alt="Raven Logo" className="landing-page-logo" />
            </h1>
            <p className="landing-page-description space-mono-regular">
                Track your daily progress, highlights, and improvements. Raven is a fast and intelligent way to track your day. It does the heavy lifting for you, so you can focus on what matters.
            </p>
        </motion.div>
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="landing-page-buttons-container"
        >
            <button
                onClick={onShowLogin}
                className="landing-page-login-button"
                aria-label="Login"
            >
                Login
            </button>
            <button
                onClick={onShowSignup}
                className="landing-page-signup-button"
                aria-label="Sign Up"
            >
                Sign Up
            </button>
        </motion.div>
    </div>
  );
};

export default LandingPage;
