import { Context } from '@deepseek-ai/cordis'
import { describe, expect, it } from 'vitest'
import { apply } from '../src/index.ts'

describe('ui-pet node plugin', () => {
  it('mounts an inert host body', async () => {
    const ctx = new Context()
    await ctx.plugin({ apply }).await()
    // The node half is deliberately empty: the pet is browser-only chrome and
    // registers no host service, tool, or event listener.
    expect(ctx.fiber).toBeDefined()
    await ctx.fiber.dispose()
  })
})
