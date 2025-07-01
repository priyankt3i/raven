import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User } from '../types';
import { UserCircleIcon, AtSymbolIcon } from './icons/Icons';

interface AccountPageProps {
  user: User;
  onSave: (user: User) => void;
  onClose: () => void;
}

const AccountPage: React.FC<AccountPageProps> = ({ user, onSave, onClose }) => {
  const [formData, setFormData] = useState<User>(user);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

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
        <h2 className="account-page-title">Account Details</h2>
        <form onSubmit={handleSubmit} className="task-form-form"> {/* Reusing task-form-form */}
          <div className="auth-input-wrapper"> {/* Reusing auth-input-wrapper */}
            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" className="auth-input-field" /> {/* Reusing auth-input-field */}
             <UserCircleIcon className="auth-input-icon" /> {/* Reusing auth-input-icon */}
          </div>
          <div className="auth-input-wrapper"> {/* Reusing auth-input-wrapper */}
             <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" className="auth-input-field" /> {/* Reusing auth-input-field */}
             <UserCircleIcon className="auth-input-icon" /> {/* Reusing auth-input-icon */}
          </div>
          <div className="auth-input-wrapper"> {/* Reusing auth-input-wrapper */}
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="auth-input-field" required /> {/* Reusing auth-input-field */}
            <AtSymbolIcon className="auth-input-icon" /> {/* Reusing auth-input-icon */}
          </div>
          <p className="account-page-info-text">Password and contact details functionality coming soon.</p>
          <div className="account-page-actions">
            <button type="button" onClick={onClose} className="task-form-cancel-button">Cancel</button> {/* Reusing task-form-cancel-button */}
            <button type="submit" className="task-form-submit-button">Save Changes</button> {/* Reusing task-form-submit-button */}
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AccountPage;
