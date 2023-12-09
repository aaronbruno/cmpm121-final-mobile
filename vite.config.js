import { defineConfig } from "vite";

export default defineConfig({
  // eslint-disable-next-line no-undef
  base: process.env.REPO_NAME || "/repo-name/",
  build: {
    assetInlineLimit: "50"
  }
});
