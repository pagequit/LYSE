import { defineConfig } from "vite";
import { readdir } from "node:fs/promises";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
  server: { port: 3080 },
  build: { target: "esnext" },
  plugins: [
    solidPlugin(),
    {
      name: "asset-indexer",
      buildStart: async function () {
        const assets = await readdir("public", { withFileTypes: true });
        const index = assets
          .filter((a) => a.isFile() && a.name !== "assetindex.json")
          .map((a) => a.name);
        await Bun.write("public/assetindex.json", JSON.stringify(index));
      },
    },
  ],
});
