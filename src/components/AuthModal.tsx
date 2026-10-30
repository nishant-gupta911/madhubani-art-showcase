import React, { useState } from 'react';
import { X, Mail, Lock, User } from 'lucide-react';
import { MithilaMotif } from './MithilaMotif';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (userName: string, email: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim() || (mode === 'signup' && !name.trim())) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    const displayName = mode === 'signup' ? name : email.split('@')[0];
    onLoginSuccess(displayName, email);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[950] flex items-center justify-center p-4"
      style={{ background: 'rgba(16,11,4,0.75)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div
        className="relative max-w-md w-full p-8 space-y-6 animate-fade-up"
        style={{
          background: 'var(--ivory)',
          border: '1px solid var(--hairline)',
          borderRadius: '4px',
          boxShadow: '0 20px 50px rgba(16,11,4,0.25)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <MithilaMotif type="four-corners" color="var(--vermilion)" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 btn btn-icon"
          style={{ background: 'var(--ivory-deep)', borderColor: 'var(--hairline-soft)' }}
          aria-label="Close modal"
        >
          <X size={15} />
        </button>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center opacity-30">
            <MithilaMotif type="peacock-eye" color="var(--vermilion)" width={32} height={32} />
          </div>
          <h2 className="font-display font-bold text-headline" style={{ color: 'var(--ink)' }}>
            {mode === 'login' ? 'Collector Sign In' : 'Create Collector Account'}
          </h2>
          <p className="text-body-sm" style={{ color: 'var(--ink-muted)' }}>
            {mode === 'login' ? 'Access your saved pieces and order registry' : 'Join the circle for authentic provenance updates'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div className="space-y-1">
              <label className="input-label">Full Name</label>
              <div className="relative">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" style={{ color: 'var(--ink-muted)' }} />
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Arjun Sharma"
                  className="input w-full"
                  style={{ paddingLeft: '2.5rem' }}
                  required
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="input-label">Email Address</label>
            <div className="relative">
              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" style={{ color: 'var(--ink-muted)' }} />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input w-full"
                style={{ paddingLeft: '2.5rem' }}
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="input-label">Password</label>
            <div className="relative">
              <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" style={{ color: 'var(--ink-muted)' }} />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input w-full"
                style={{ paddingLeft: '2.5rem' }}
                required
              />
            </div>
          </div>

          {error && <p className="text-caption text-vermilion" style={{ color: 'var(--vermilion)' }}>{error}</p>}

          <button type="submit" className="btn btn-primary btn-lg w-full justify-center">
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="text-center pt-2">
          <button
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            className="text-caption font-semibold transition-colors hover:text-vermilion"
            style={{ color: 'var(--ink-soft)' }}
          >
            {mode === 'login' ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
          </button>
        </div>

        {/* Continue as Guest */}
        <div
          className="pt-4 text-center border-t"
          style={{ borderColor: 'var(--hairline-soft)' }}
        >
          <button
            onClick={onClose}
            className="text-caption font-semibold transition-colors hover:text-vermilion"
            style={{ color: 'var(--ink-muted)', letterSpacing: '0.04em' }}
          >
            Continue browsing as Guest
          </button>
        </div>
      </div>
    </div>
  );
};
