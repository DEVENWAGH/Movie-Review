import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { createRequestHandler } from "@react-router/serve";

// Get the directory name of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Define paths
const BUILD_DIR = path.join(__dirname, "../build");
const SERVER_BUILD_PATH = path.join(BUILD_DIR, "server/index.js");
const CLIENT_BUILD_PATH = path.join(BUILD_DIR, "client");

// Handler function for all requests
export default async function handler(req, res) {
  try {
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
      return res.end(`Server Error: Failed to import build`);
    }

    // Use the React Router request handler for all other paths
    return createRequestHandler({
      build,
      mode: process.env.NODE_ENV,
    })(req, res);
  } catch (error) {
    console.error("Server error:", error);
    res.statusCode = 500;
    res.end(`Server Error: ${error.message || "Unknown error"}`);
  }
}

async function importBuild() {
  try {
    // Dynamic import of the server build
    const build = await import("../build/server/index.js");
    return build;
  } catch (error) {
    console.error("Failed to import server build:", error);
    throw error;
  }
}

function getContentType(pathname) {
  const ext = path.extname(pathname).toLowerCase();
  const contentTypes = {
    ".js": "application/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
  };

  return contentTypes[ext] || "text/plain";
}
