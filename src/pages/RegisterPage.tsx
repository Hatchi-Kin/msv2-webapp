import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Mail, Lock, User } from "lucide-react";
import { Link } from "react-router-dom";
import AuthPageLayout from "@/components/AuthPageLayout";
import FormInput from "@/components/FormInput";
import SubmitButton from "@/components/SubmitButton";
import ErrorAlert from "@/components/ErrorAlert";

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const { register, loading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (password !== confirmPassword) {
      setValidationError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setValidationError("Password must be at least 8 characters long");
      return;
    }

    await register({ email, password, username });
  };

  const displayError = validationError || error;

  return (
    <AuthPageLayout
      title="Create Account"
      subtitle="Start your journey through sound"
      description="Discover music through connections that lead you deeper into your sonic universe"
      footer={
        <div className="text-center mt-6">
          <p className="text-sm text-foreground opacity-70">
            Already have an account?{" "}
            <Link
              to="/"
              className="font-semibold transition-colors text-primary hover:text-secondary"
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

        {displayError && <ErrorAlert message={displayError} variant="error" />}

        <SubmitButton loading={loading} loadingText="Creating account...">
          Create Account
        </SubmitButton>
      </form>
    </AuthPageLayout>
  );
};

export default RegisterPage;
