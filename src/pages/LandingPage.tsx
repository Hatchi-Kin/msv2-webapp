import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Mail, Lock } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import AuthPageLayout from "@/components/AuthPageLayout";
import FormInput from "@/components/FormInput";
import SubmitButton from "@/components/SubmitButton";
import ErrorAlert from "@/components/ErrorAlert";

const LandingPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, error } = useAuth();
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
      subtitle="Continue your musical exploration"
      description="Navigate through sound similarities and make sonic discoveries"
      footer={
        <div className="text-center mt-6">
          <p className="text-sm text-foreground opacity-70">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold transition-colors text-primary hover:text-secondary"
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
          <ErrorAlert
            message="Your session has expired. Please sign in again."
            variant="warning"
          />
        )}

        {error && <ErrorAlert message={error} variant="error" />}

        <SubmitButton loading={loading} loadingText="Signing in...">
          Sign in
        </SubmitButton>
      </form>
    </AuthPageLayout>
  );
};

export default LandingPage;
