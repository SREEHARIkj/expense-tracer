import app from "./src/server/app";

Bun.serve({
  fetch: app.fetch,
});

console.log("Server is running...");
