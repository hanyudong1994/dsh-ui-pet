/**
 * Desktop pet plugin, browser half: PetOverlay registered as the `pet` entry
 * of the frame-declared `shell.overlay` list slot. The entry reads the
 * sessions-list standard feed only — no business face, no store, no locale.
 * Export discipline: packages/client/AGENTS.md.
 */
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
// Type-only: pulls the ui-layout SlotMap merge declaring the 'shell.overlay' seat.
import type {} from '@deepseek-ai/dsh-client-ui-layout/client'
import { PetOverlay } from './PetOverlay.tsx'

/** Required services: the slot registry. */
export const inject = ['slots']

/**
 * Client plugin body: register the pet into the frame overlay. The overlay
 * seat exists only while ui-layout's frame entry is live, so the registration
 * rides `slots.inject` — it waits on the declaration, re-runs after a
 * redeclaration, and leaves with this plugin's fiber.
 * @param ctx - client root context.
 */
export function apply(ctx: ClientContext): void {
  ctx.slots.inject('shell.overlay', () => ctx.slots.register(
    { name: 'shell.overlay', id: 'pet' },
    PetOverlay,
  ))
}
