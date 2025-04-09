import { createRequestHandler } from "@react-router/node";
import * as path from "path";

// Dynamically import the build output
async function loadBuild() {
  try {
    // Adjust the path according to your build output structure
    return await import(path.join(process.cwd(), "build/server/index.js"));
  } catch (error) {
    console.error("Failed to load server build:", error);
    throw error;
  }
}

export default async function handler(req, res) {
  try {
    const build = await loadBuild();
    
    return createRequestHandler({
      build,
      mode: process.env.NODE_ENV,
      getLoadContext() {
        // You can provide a custom context here if needed
        return {};
      }
    })(req, res);
  } catch (error) {
    console.error("Handler error:", error);
    res.statusCode = 500;
    res.end(`Server Error: ${error.message || "Unknown error"}`);
  }
}
