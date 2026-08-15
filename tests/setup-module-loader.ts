import { createRequire } from 'node:module'

// Emulates the dsh shell's frozen module table for node-env tests: the
// published /client bundles hand their exports to
// window.__ModuleLoader__.load({ id, factory }), so a node test defines the
// same handoff, runs each factory with a require that resolves the shell's
// externals (react, cordis, ui-slots, ...) from node_modules, and keeps the
// resulting exports keyed by plugin id.
const nodeRequire = createRequire(import.meta.url)

type Factory = (require: (id: string) => unknown) => unknown

const entries = new Map<string, Record<string, unknown>>()

if (typeof globalThis.window === 'undefined') {
  ;(globalThis as unknown as { window: unknown }).window = {
    __ModuleLoader__: {
      load({ id, factory }: { id: string; factory: Factory }) {
        entries.set(id, factory((specifier: string) => nodeRequire(specifier)) as Record<string, unknown>)
      },
    },
  }
}

/**
 * The exports a loaded plugin bundle handed to the module loader under its id.
 * @param id - plugin id stamped into the bundle (the package name).
 * @returns the bundle's exports object.
 */
export function loaderExports(id: string): Record<string, unknown> {
  const entry = entries.get(id)
  if (entry === undefined) throw new Error(`module-loader test setup: no bundle entry for ${id}`)
  return entry
}
