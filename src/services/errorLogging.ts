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

  // Check if error is related to TMDB authentication
  if (error.message?.includes('authentication') || 
      error.message?.includes('auth') || 
      error.message?.includes('api_key') ||
      error.message?.toLowerCase().includes('unauthorized')) {
    // Attempt to reauthenticate
    handleAuthenticationError();
  }

  // In a real app, you'd send this to a logging service
  // For example: fetch('/api/log-error', { method: 'POST', body: JSON.stringify(errorInfo) });
  
  // For now, just console log in production as a fallback
  console.error('[Production Error]', errorInfo);
};

/**
 * Handle TMDB authentication errors by trying to refresh the session
 */
const handleAuthenticationError = async (): Promise<void> => {
  try {
    // Import auth service dynamically to avoid circular dependencies
    const { initializeTMDB } = await import('./authService');
    await initializeTMDB(true); // Pass true to force reinitialization
    console.log('Successfully re-authenticated with TMDB');
  } catch (err) {
    console.error('Failed to re-authenticate with TMDB:', err);
  }
};
