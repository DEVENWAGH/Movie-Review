import { createRequestHandler } from "@react-router/node";
import * as remixBuild from "../../build/server/index.js";

export default createRequestHandler({
  build: remixBuild,
  getLoadContext() {
    // You can provide a custom context here if needed
    return {};
  },
  mode: process.env.NODE_ENV
});
