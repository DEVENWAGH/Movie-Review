// Simple error logging service for production errors

/**
 * Log errors to your preferred service in production
 */
export const logError = (error: Error, componentInfo?: string): void => {
  // Skip detailed logging in development
  if (import.meta.env.DEV) {
    return;
  }

  const errorInfo = {
    message: error.message,
    stack: error.stack,
    component: componentInfo,
    timestamp: new Date().toISOString(),
  };

  // In a real app, you'd send this to a logging service
  // For example: fetch('/api/log-error', { method: 'POST', body: JSON.stringify(errorInfo) });
  
  // For now, just console log in production as a fallback
  console.error('[Production Error]', errorInfo);
};
