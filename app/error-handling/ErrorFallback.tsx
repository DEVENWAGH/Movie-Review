import { useEffect } from "react";

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary?: () => void;
}

export default function ErrorFallback({
  error,
  resetErrorBoundary,
}: ErrorFallbackProps) {
  // Log error to console in development only
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.error("Error caught by error boundary:", error);
    }
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-4 text-white">
      <h2 className="mb-4 text-xl font-bold">Something went wrong</h2>
      <p className="mb-4 text-center">Please try again later</p>
      {resetErrorBoundary && (
        <button
          onClick={resetErrorBoundary}
          className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          Try again
        </button>
      )}
    </div>
  );
}
