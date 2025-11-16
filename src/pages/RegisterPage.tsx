import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Mail, Lock, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthPageLayout from '@/components/AuthPageLayout';
import FormInput from '@/components/FormInput';
import SubmitButton from '@/components/SubmitButton';
import { MOCHA_THEME } from '@/constants/theme';
import { useThemeHover } from '@/hooks/useThemeHover';

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const { register, loading, error } = useAuth();
  const { handleLinkMouseEnter, handleLinkMouseLeave } = useThemeHover();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (password !== confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setValidationError('Password must be at least 8 characters long');
      return;
    }

    await register({ email, password, username });
  };

  const displayError = validationError || error;

  return (
    <AuthPageLayout
      title="Create Account"
      subtitle="Join us and organize your music beautifully"
      description="Create your account and start exploring your music universe"
      footer={
        <div className="text-center mt-6">
          <p
            className="text-sm"
            style={{ color: MOCHA_THEME.colors.text, opacity: MOCHA_THEME.opacity.visible }}
          >
            Already have an account?{' '}
            <Link
              to="/"
              className="font-semibold transition-colors"
              style={{ color: MOCHA_THEME.colors.primary }}
              onMouseEnter={handleLinkMouseEnter}
              onMouseLeave={handleLinkMouseLeave}
            >
              Sign in
            </Link>
          </p>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <FormInput
          id="username"
          label="Username"
          type="text"
          placeholder="Choose a username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          icon={<User className="w-4 h-4" />}
          required
        />

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
          placeholder="Create a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={<Lock className="w-4 h-4" />}
          required
        />

        <FormInput
          id="confirmPassword"
          label="Confirm Password"
          type="password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          icon={<Lock className="w-4 h-4" />}
          required
        />

        {displayError && (
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
            <span>{displayError}</span>
          </div>
        )}

        <SubmitButton loading={loading} loadingText="Creating account...">
          Create Account
        </SubmitButton>
      </form>
    </AuthPageLayout>
  );
};

export default RegisterPage;
