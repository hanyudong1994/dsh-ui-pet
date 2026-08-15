/**
 * apply wiring on a real cordis Context + SlotRegistry: PetOverlay registered
 * as the `pet` list entry of the frame-declared shell.overlay slot,
 * declaration-aware activation through slots.inject, and fiber-teardown
 * unregistration. Component behavior is covered props-direct in
 * pet-overlay.client.spec.tsx; no renderer machinery here.
 *
 * The published runtime /client bundle hands its exports to
 * window.__ModuleLoader__.load, so this spec imports the bundle for its
 * side effect and reads the SlotRegistry value back through the module-loader
 * test harness in setup-module-loader.ts (the monorepo checkout instead
 * resolves /client to source and imports it directly).
 */
import type { SlotRegistry } from '@deepseek-ai/dsh-client-runtime/client'
import '@deepseek-ai/dsh-client-runtime/client'
import { Context } from '@deepseek-ai/cordis'
import { describe, expect, it } from 'vitest'
import { loaderExports } from './setup-module-loader.ts'
import { PetOverlay } from '../src/client/PetOverlay.tsx'
import { apply, inject } from '../src/client/index.ts'

type SlotRegistryClass = new (ctx: Context, config?: unknown) => SlotRegistry

const SlotRegistryClass = (loaderExports('@deepseek-ai/dsh-client-runtime') as { SlotRegistry: SlotRegistryClass }).SlotRegistry

/** Declare the frame overlay seat the way ui-layout's frame entry does. */
function declareOverlay(slots: SlotRegistry): void {
  slots.register(
    { name: 'root', children: { 'shell.overlay': { kind: 'list', scope: 'root' } } } as never,
    () => null,
  )
}

describe('apply', () => {
  it('declares the services it binds', () => {
    expect(inject).toEqual(['slots'])
  })

  it('waits until a live entry declares the overlay slot', async () => {
    const ctx = new Context()
    await ctx.plugin(SlotRegistryClass).await()
    const fiber = ctx.plugin({ inject: [...inject], apply })
    await fiber.await()
    expect(ctx.slots.entries('shell.overlay')).toHaveLength(0)
    declareOverlay(ctx.slots)
    await Promise.resolve()
    expect(ctx.slots.entries('shell.overlay')).toHaveLength(1)
    await fiber.dispose()
  })

  it('registers the pet entry with no business face', async () => {
    const ctx = new Context()
    await ctx.plugin(SlotRegistryClass).await()
    declareOverlay(ctx.slots)
    await ctx.plugin({ inject: [...inject], apply }).await()
    const entry = ctx.slots.entries('shell.overlay')[0]!
    expect(entry.options.id).toBe('pet')
    expect(entry.component).toBe(PetOverlay)
    expect(entry.inject).toBeUndefined()
    await ctx.fiber.dispose()
  })

  it('teardown unregisters the slot entry', async () => {
    const ctx = new Context()
    await ctx.plugin(SlotRegistryClass).await()
    declareOverlay(ctx.slots)
    const fiber = ctx.plugin({ inject: [...inject], apply })
    await fiber.await()
    expect(ctx.slots.entries('shell.overlay')).toHaveLength(1)
    await fiber.dispose()
    expect(ctx.slots.entries('shell.overlay')).toHaveLength(0)
  })
})
