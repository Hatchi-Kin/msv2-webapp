import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Link, useLocation } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import AuthPageLayout from "./AuthPageLayout";
import FormInput from "./FormInput";
import SubmitButton from "./SubmitButton";
import ErrorAlert from "@/components/ui/ErrorAlert";

const LandingPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loginAsGuest, loading, error } = useAuth();

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

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border/50" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => loginAsGuest()}
          disabled={loading}
          className="w-full h-12 text-primary font-semibold rounded-xl border-2 border-primary/20 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 hover:-translate-y-0.5"
        >
          Try as Guest
        </button>
      </form>
    </AuthPageLayout>
  );
};

export default LandingPage;
