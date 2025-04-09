import { createRequestHandler } from "@react-router/node";
import * as path from "path";

// Cache the build to avoid repeated imports
let buildCache;

// Dynamically import the build output
async function loadBuild() {
  if (buildCache) return buildCache;
  
  try {
    // Try the primary build path first
    try {
      buildCache = await import(path.join(process.cwd(), "build/server/index.js"));
      return buildCache;
    } catch (e) {
      // Fallback path (sometimes Vercel structures builds differently)
      buildCache = await import(path.join(process.cwd(), ".vercel/output/functions/_build/server/index.js"));
      return buildCache;
    }
  } catch (error) {
    console.error("Failed to load server build:", error);
    throw new Error(`Failed to load server build: ${error.message}`);
  }
}

export default async function handler(req, res) {
  try {
    // Set CORS headers to prevent issues with API requests
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    
    // Handle OPTIONS requests (preflight)
    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }
    
    const build = await loadBuild();
    
    // Better error handling for the request handler
    return createRequestHandler({
      build,
      mode: process.env.NODE_ENV,
      getLoadContext() {
        return {
          // You can provide environment variables or other context here
          env: {
            TMDB_API_KEY: process.env.VITE_TMDB_API_KEY,
            TMDB_ACCESS_TOKEN: process.env.VITE_TMDB_ACCESS_TOKEN,
            TMDB_ACCOUNT_ID: process.env.VITE_TMDB_ACCOUNT_ID,
          }
        };
      }
    })(req, res);
  } catch (error) {
    console.error("Handler error:", error);
    
    // Proper error response
    res.status(500);
    res.setHeader("Content-Type", "text/html");
    res.end(`
      <html>
        <head><title>Server Error</title></head>
        <body>
          <h1>Server Error</h1>
          <p>Sorry, something went wrong. Please try again later.</p>
          ${process.env.NODE_ENV === 'development' ? `<pre>${error.stack || error.message}</pre>` : ''}
        </body>
      </html>
    `);
  }
}
