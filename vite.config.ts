import path from "path";
import { defineConfig } from "vite";
import { watchAndRun } from "vite-plugin-watch-and-run";

export default defineConfig({
  plugins: [
    watchAndRun([
      {
        name: "wasm",
        watch: path.resolve("wasm/src/**/*.rs"),
        run: "bun wasm",
      },
    ]),
  ],
  server: {
    port: 3080,
  },
});
