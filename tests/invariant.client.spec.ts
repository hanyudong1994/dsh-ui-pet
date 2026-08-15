import { describe, expect, it } from 'vitest'
import { Context } from '@deepseek-ai/cordis'
import InvariantRegistry from '@deepseek-ai/dsh-invariants'
import * as PetInvariant from '../src/invariant.ts'

describe('invariant companion', () => {
  it('declares its service edges', () => {
    expect(PetInvariant.name).toBe('dsh-desktop-pet-invariant')
    expect(PetInvariant.inject).toEqual(['invariants'])
  })

  it('registers under the package name with an empty installer', async () => {
    const ctx = new Context()
    await ctx.plugin(InvariantRegistry, { enabled: true })
    await expect(ctx.plugin(PetInvariant).await()).resolves.toBeDefined()
  })
})
