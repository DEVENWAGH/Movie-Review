import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createRequestHandler } from "@react-router/node";

// Get the directory name properly in ESM
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CLIENT_BUILD_PATH = path.join(__dirname, "../build/client");
const SERVER_BUILD_PATH = path.join(__dirname, "../build/server");

// Define content type mapping for static assets
function getContentType(pathname) {
  const ext = path.extname(pathname).toLowerCase();
  const types = {
    ".js": "application/javascript",
    ".css": "text/css",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".ico": "image/x-icon",
    ".svg": "image/svg+xml",
    ".json": "application/json",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
  };

  return types[ext] || "text/plain";
}

// Cache the build to avoid repeated imports
let buildCache;

// Import the build dynamically
async function importBuild() {
  if (buildCache) return buildCache;

  try {
    // Use dynamic import for the server build
    const buildPath = path.join(process.cwd(), "build/server/index.js");
    if (fs.existsSync(buildPath)) {
      buildCache = await import(buildPath);
      return buildCache;
    } else {
      // For Vercel deployment
      const vercelBuildPath = "/var/task/build/server/index.js";
      buildCache = await import(vercelBuildPath);
      return buildCache;
    }
  } catch (error) {
    console.error("Failed to import build:", error);
    throw error;
  }
}

// Handler function for all requests
export default async function handler(req, res) {
  try {
    // Set CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );

    // Handle OPTIONS requests
    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }

    // Check if the file exists in the client build directory
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;

    // Check if this is an asset request
    if (pathname.startsWith("/assets/")) {
      const assetPath = path.join(CLIENT_BUILD_PATH, pathname);
      if (fs.existsSync(assetPath)) {
        const content = fs.readFileSync(assetPath);
        const contentType = getContentType(pathname);
        res.setHeader("Content-Type", contentType);
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        return res.end(content);
      }
    }

    // Import the build dynamically
    let build;
    try {
      build = await importBuild();
    } catch (importError) {
      console.error("Failed to import build:", importError);
      res.statusCode = 500;
      return res.end(
        `Server Error: Failed to import build. Details: ${importError.message}`
      );
    }

    // Use the React Router request handler for all other paths
    return createRequestHandler({
      build,
      mode: process.env.NODE_ENV,
      getLoadContext() {
        return {
          env: process.env,
        };
      },
    })(req, res);
  } catch (error) {
    console.error("Server error:", error);
    res.statusCode = 500;
    res.end(`Server Error: ${error.message || "Unknown error"}`);
  }
}
