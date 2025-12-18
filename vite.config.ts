import react from "@vitejs/plugin-react";
import tailwind from "tailwindcss";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "./",
  css: {
    postcss: {
      plugins: [tailwind()],
    },
  },
  server: {
    host: true,
    allowedHosts: [
      "ourbusway-alb-1436595524.us-east-1.elb.amazonaws.com"
    ]
  }
});
