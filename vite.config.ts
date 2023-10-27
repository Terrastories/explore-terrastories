import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import checker from 'vite-plugin-checker'
import svgr from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    // Match CRA so we don't have to change other configuration
    port: 1080,
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
        lintCommand: 'eslint "./src/**/*.{ts,tsx}"',
      },
    }),
    // Allow SVGs as React components
    svgr()
  ]
})