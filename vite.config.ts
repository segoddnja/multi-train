import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
const isGhPages = process.env.VITE_DEPLOY_TARGET === "gh-pages";
export default defineConfig({
  base: isGhPages ? "/multi-train/" : "/",
  plugins: [react(), tailwindcss()],
});
