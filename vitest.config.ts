import { defineConfig } from 'vitest/config'

// Node-env specs run the published /client bundles through the module-loader
// harness in tests/setup-module-loader.ts; jsdom specs keep the real window
// (the setup skips itself there).
export default defineConfig({
  test: {
    include: ['tests/**/*.spec.{ts,tsx}'],
    environment: 'node',
    restoreMocks: true,
    setupFiles: ['./tests/setup-module-loader.ts'],
  },
})
