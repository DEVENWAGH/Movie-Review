import { createRequestHandler } from "@react-router/node";
import * as path from "path";
import * as fs from "fs";

// Cache the build to avoid repeated imports
let buildCache;

// Dynamically import the build output
async function loadBuild() {
  if (buildCache) return buildCache;
  
  const possiblePaths = [
    path.join(process.cwd(), "build/server/index.js"),
    path.join(process.cwd(), ".vercel/output/functions/_build/server/index.js"),
    "/var/task/build/server/index.js",
    path.join(process.cwd(), ".output/server/index.mjs"),
    path.join(process.cwd(), ".vercel/output/server/index.js")
  ];
  
  console.log("Current directory:", process.cwd());
  console.log("Attempting to load build from the following paths:");
  possiblePaths.forEach(p => console.log(`- ${p} (exists: ${fs.existsSync(p)})`));
  
  for (const buildPath of possiblePaths) {
    try {
      if (fs.existsSync(buildPath)) {
        console.log(`Loading build from: ${buildPath}`);
        buildCache = await import(buildPath);
        return buildCache;
      }
    } catch (e) {
      console.log(`Failed to load from ${buildPath}:`, e.message);
    }
  }
  
  throw new Error(`Could not find server build in any of the expected locations`);
}

export default async function handler(req, res) {
  try {
    // Log request information for debugging
    console.log(`Handling ${req.method} request to ${req.url}`);
    
    // Set CORS headers to prevent issues with API requests
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    
    // Handle OPTIONS requests (preflight)
    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }
    
    // Verify environment variables are available
    const envVars = {
      NODE_ENV: process.env.NODE_ENV,
      VITE_TMDB_API_KEY: process.env.VITE_TMDB_API_KEY ? "set" : "missing",
      VITE_TMDB_ACCESS_TOKEN: process.env.VITE_TMDB_ACCESS_TOKEN ? "set" : "missing",
      VITE_TMDB_ACCOUNT_ID: process.env.VITE_TMDB_ACCOUNT_ID ? "set" : "missing"
    };
    console.log("Environment variables status:", envVars);
    
    const build = await loadBuild();
    console.log("Build loaded successfully");
    
    // Better error handling for the request handler
    return createRequestHandler({
      build,
      mode: process.env.NODE_ENV,
      getLoadContext() {
        return {
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
          <p>Error type: ${error.name}</p>
          ${process.env.NODE_ENV === 'development' || process.env.DEBUG === 'true' ? 
            `<pre>${error.stack || error.message}</pre>` : ''}
        </body>
      </html>
    `);
  }
}
