/**
 * Pure pet-state derivations shared by the overlay component and its tests.
 * Presentation-only: nothing here is logged or model-visible.
 */

/** The pet's visible activity state. */
export type PetMode = 'sleep' | 'idle' | 'working'

/** The sessions-list facts the mode derives from. */
export interface PetActivity {
  /** A current session is selected. */
  hasCurrentSession: boolean
  /** The current session's agent is running (the list row's `running` flag). */
  running: boolean
}

/**
 * Derive the pet mode from current-session activity.
 * @param activity - current-session facts from the sessions list.
 * @returns sleep without a current session, working while it runs, idle otherwise.
 */
export function derivePetMode(activity: PetActivity): PetMode {
  if (!activity.hasCurrentSession) return 'sleep'
  return activity.running ? 'working' : 'idle'
}

/**
 * Status bubble copy per mode (in-product Chinese).
 * @param mode - the derived pet mode.
 * @returns the bubble text.
 */
export function bubbleText(mode: PetMode): string {
  switch (mode) {
    case 'sleep': return '呼…'
    case 'idle': return '喵？'
    case 'working': return '加油！'
  }
}

/** Poke reactions, cycled per click. */
export const PET_REACTIONS = ['喵！', '呼噜…', '呀！'] as const

/**
 * The reaction shown for the nth poke, 1-based (cycles through
 * {@link PET_REACTIONS}).
 * @param poke - the poke number, counting from 1.
 * @returns the reaction copy.
 */
export function reactionFor(poke: number): string {
  /* v8 ignore next -- a non-negative modulo stays within the tuple bounds */
  return PET_REACTIONS[(poke - 1) % PET_REACTIONS.length] ?? PET_REACTIONS[0]
}
