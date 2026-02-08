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
          className="relative w-full h-14 text-base font-bold rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 border-2 border-primary/30 hover:border-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
        >
          {/* Animated background on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Content */}
          <span className="relative flex items-center justify-center gap-2.5 text-primary">
            <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Try as Guest</span>
            <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </button>
      </form>
    </AuthPageLayout>
  );
};

export default LandingPage;
