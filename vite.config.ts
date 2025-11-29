import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tsconfigPaths from "vite-tsconfig-paths"
import checker from "vite-plugin-checker"
import svgr from "vite-plugin-svgr"

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.VITE_BASE_PATH || "/",
  server: {
    // Match CRA so we don't have to change other configuration
    port: 1080,
    // Proxy API requests to avoid CORS issues in development
    proxy: {
      "/api": {
        target: "https://our.terrastories.app",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path
      }
    }
  },
  plugins: [
    // Use React
    react(),
    // Easy configuration for TypeScript imports
    // This allows us to import using absolute paths
    //   such as `import translations/i18n` instead of
    //   needing `import ./translations/i18n`.
    tsconfigPaths(),
    checker({
      typescript: true,
      eslint: {
        // for example, lint .ts and .tsx
        lintCommand: "eslint './src/**/*.{ts,tsx}'",
      },
    }),
    // Allow SVGs as React components
    svgr({
      svgrOptions: {
        titleProp: true
      }
    })
  ],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
    exclude: ["node_modules", "e2e/**"]
  }
})