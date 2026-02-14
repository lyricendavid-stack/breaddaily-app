import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("BreadDaily Runtime Error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFBF7] dark:bg-[#0F1115] p-6 text-center transition-colors">
          <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-full mb-4">
            <AlertCircle size={48} className="text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2 font-serif-bible">
            The oven got too hot.
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mb-8 max-w-xs mx-auto">
            Something went wrong while baking your daily bread.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#D4A373] text-white px-8 py-3 rounded-[1.5rem] font-bold shadow-lg hover:scale-105 active:scale-95 transition-all"
          >
            Reload App
          </button>
          {this.state.error && (
            <details className="mt-8 text-xs text-zinc-400 text-left max-w-sm overflow-auto">
              <summary>Technical Details</summary>
              <pre className="mt-2 p-2 bg-zinc-100 dark:bg-zinc-900 rounded">
                {this.state.error.toString()}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}