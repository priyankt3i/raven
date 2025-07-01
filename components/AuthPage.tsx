import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User } from '../types';
import { LockClosedIcon, AtSymbolIcon } from './icons/Icons';

interface AuthPageProps {
  initialMode: 'login' | 'signup';
  onAuthSuccess: (user: User) => void;
  onBack: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ initialMode, onAuthSuccess, onBack }) => {
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'signup' && password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    
    if (!email || !password) {
        setError("Please fill in all fields.");
        return;
    }

    // Simulate successful authentication
    // In a real app, you'd fetch user data on login
    onAuthSuccess({ email, firstName: '', lastName: '' });
  };

  const switchMode = () => {
    setMode(prevMode => (prevMode === 'login' ? 'signup' : 'login'));
    setError('');
  };

  return (
    <div className="auth-page-container">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="auth-content-wrapper"
      >
        <button onClick={onBack} className="auth-back-button space-mono-regular-italic">
          &larr; Back to Home
        </button>
        <div className="auth-title-container">
            <h1 className="auth-main-title space-mono-bold">
                {mode === 'login' ? 'Welcome Back' : 'Join Raven'}
            </h1>
            <p className="auth-subtitle space-mono-regular">
                {mode === 'login' ? 'Log in to continue your journey.' : 'Create an account to start planning.'}
            </p>
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form-container">
          <div className="auth-input-wrapper">
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="auth-input-field" required />
            <AtSymbolIcon className="auth-input-icon" />
          </div>
          <div className="auth-input-wrapper">
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="auth-input-field" required />
            <LockClosedIcon className="auth-input-icon" />
          </div>
          {mode === 'signup' && (
            <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="auth-input-wrapper"
            >
                <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="auth-input-field" required />
                <LockClosedIcon className="auth-input-icon" />
            </motion.div>
          )}

          {error && <p className="auth-error-message">{error}</p>}

          <button type="submit" className="auth-submit-button">
            {mode === 'login' ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-switch-mode-container">
          <button onClick={switchMode} className="auth-switch-mode-button">
            {mode === 'login' ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
export default AuthPage;
