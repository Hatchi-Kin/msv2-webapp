import { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary Component
 *
 * Catches JavaScript errors anywhere in the child component tree
 * and displays a fallback UI instead of crashing the whole app.
 */
class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-mocha-gradient p-6">
          <div className="max-w-md w-full backdrop-blur-lg bg-background rounded-2xl p-8 border border-border shadow-lg">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 rounded-full bg-destructive/10">
                <AlertCircle className="h-12 w-12 text-destructive" />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Oops! Something went wrong
                </h1>
                <p className="text-sm text-foreground opacity-70">
                  The app encountered an unexpected error. Don't worry, your
                  data is safe.
                </p>
              </div>

              {this.state.error && (
                <details className="w-full text-left">
                  <summary className="text-sm text-foreground opacity-60 cursor-pointer hover:opacity-100">
                    Technical details
                  </summary>
                  <pre className="mt-2 p-3 bg-muted rounded-lg text-xs overflow-auto max-h-32">
                    {this.state.error.toString()}
                  </pre>
                </details>
              )}

              <Button onClick={this.handleReset} className="w-full">
                Return to Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
