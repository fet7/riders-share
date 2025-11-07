#!/usr/bin/env node

const path = require("path");
const { pathToFileURL } = require("url");

async function startServer() {
  try {
    console.log("🚀 Starting server...");

    // Resolve full path to server.js and convert to file URL
    const serverPath = path.resolve(__dirname, "server.js");
    const serverURL = pathToFileURL(serverPath);

    await import(serverURL.href); // Dynamically load ES module

    console.log("✅ Server started from:", serverPath);
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
}

startServer();