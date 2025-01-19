import { defineConfig } from "vite";

export default defineConfig({
  server: { port: 3080 },
  build: {
    target: "esnext",
  },
});
