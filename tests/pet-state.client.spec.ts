import { describe, expect, it } from 'vitest'
import { bubbleText, derivePetMode, PET_REACTIONS, reactionFor } from '../src/client/pet-state.ts'

describe('derivePetMode', () => {
  it('sleeps without a current session', () => {
    expect(derivePetMode({ hasCurrentSession: false, running: true })).toBe('sleep')
  })

  it('works while the current session runs', () => {
    expect(derivePetMode({ hasCurrentSession: true, running: true })).toBe('working')
  })

  it('idles when the current session is not running', () => {
    expect(derivePetMode({ hasCurrentSession: true, running: false })).toBe('idle')
  })
})

describe('bubbleText', () => {
  it('names every mode', () => {
    expect(bubbleText('sleep')).toBe('呼…')
    expect(bubbleText('idle')).toBe('喵？')
    expect(bubbleText('working')).toBe('加油！')
  })
})

describe('reactionFor', () => {
  it('cycles through the reactions, 1-based', () => {
    expect(reactionFor(1)).toBe(PET_REACTIONS[0])
    expect(reactionFor(2)).toBe(PET_REACTIONS[1])
    expect(reactionFor(3)).toBe(PET_REACTIONS[2])
    expect(reactionFor(4)).toBe(PET_REACTIONS[0])
  })
})
