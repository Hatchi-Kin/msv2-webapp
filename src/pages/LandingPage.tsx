import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Mail, Lock } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import AuthPageLayout from '@/components/AuthPageLayout';
import FormInput from '@/components/FormInput';
import SubmitButton from '@/components/SubmitButton';
import { MOCHA_THEME } from '@/constants/theme';
import { useThemeHover } from '@/hooks/useThemeHover';

const LandingPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useAuth();
  const { handleLinkMouseEnter, handleLinkMouseLeave } = useThemeHover();
  const location = useLocation();

  // Check if redirected due to session expiration
  const sessionExpired = location.state?.sessionExpired;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <AuthPageLayout
      title="Welcome back"
      subtitle="Sign in to access your music library"
      description="Your personal music universe, beautifully organized and ready to discover"
      footer={
        <div className="text-center mt-6">
          <p
            className="text-sm"
            style={{ color: MOCHA_THEME.colors.text, opacity: MOCHA_THEME.opacity.visible }}
          >
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-semibold transition-colors"
              style={{ color: MOCHA_THEME.colors.primary }}
              onMouseEnter={handleLinkMouseEnter}
              onMouseLeave={handleLinkMouseLeave}
            >
              Register
            </Link>
          </p>
        </div>
      }
    >

      <form onSubmit={handleSubmit} className="space-y-5">
        <FormInput
          id="email"
          label="Email address"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<Mail className="w-4 h-4" />}
          required
        />

        <FormInput
          id="password"
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={<Lock className="w-4 h-4" />}
          required
        />

        {sessionExpired && (
          <div
            className="p-4 text-sm rounded-xl flex items-center gap-2"
            style={{
              color: MOCHA_THEME.colors.secondary,
              backgroundColor: MOCHA_THEME.colors.border,
              border: `1px solid ${MOCHA_THEME.colors.borderHover}`,
            }}
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: MOCHA_THEME.colors.secondary }}
            ></div>
            <span>Your session has expired. Please sign in again.</span>
          </div>
        )}

        {error && (
          <div
            className="p-4 text-sm rounded-xl flex items-center gap-2"
            style={{
              color: MOCHA_THEME.colors.primary,
              backgroundColor: MOCHA_THEME.colors.border,
              border: `1px solid ${MOCHA_THEME.colors.borderHover}`,
            }}
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: MOCHA_THEME.colors.primary }}
            ></div>
            <span>{error}</span>
          </div>
        )}

        <SubmitButton loading={loading} loadingText="Signing in...">
          Sign in
        </SubmitButton>
      </form>
    </AuthPageLayout>
  );
};

export default LandingPage;
