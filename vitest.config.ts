import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

// Tests import the dsh client packages through source (like the upstream
// harness checkout does): the published browser bundles reference `window` at
// module scope, so node-env specs resolve the dependencies to their shipped
// src/ trees instead.
export default defineConfig({
  plugins: [tsconfigPaths({ projects: ['tsconfig.test.json'] })],
  test: {
    include: ['tests/**/*.spec.{ts,tsx}'],
    environment: 'node',
    restoreMocks: true,
  },
})
