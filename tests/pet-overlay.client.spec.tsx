// @vitest-environment jsdom
/**
 * PetOverlay presentation: the bubble names the derived mode, and a click
 * shows the cycling reaction bubble before it reverts to the status text.
 * The sessions feed arrives as the standard global seat, stubbed here.
 */
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { SessionId, SessionListState } from '@deepseek-ai/dsh-client-runtime/client'
import type { PropsRuntime, SnapshotSelectorHook } from '@deepseek-ai/dsh-client-ui-slots'
import { PetOverlay } from '../src/client/PetOverlay.tsx'
import { PET_REACTIONS } from '../src/client/pet-state.ts'

const SID = 's1' as SessionId

afterEach(cleanup)

/** Sessions-list fixture: only the fields the pet's selectors read are honest. */
function listState(current: boolean, running: boolean | undefined): SessionListState {
  return {
    current: current ? SID : undefined,
    byId: current ? { [SID]: { running } } : {},
  } as unknown as SessionListState
}

/** The global standard-kit seat stub over one list snapshot. */
function seat(state: SessionListState): PropsRuntime<'shell.overlay'> {
  const useSessions = ((selector: (s: SessionListState) => unknown) =>
    selector(state)) as unknown as SnapshotSelectorHook<SessionListState>
  return { useSessions } as PropsRuntime<'shell.overlay'>
}

function renderPet(state: SessionListState) {
  return render(<PetOverlay {...seat(state)} />)
}

describe('PetOverlay', () => {
  it('sleeps and says so when no session is current', () => {
    renderPet(listState(false, false))
    expect(screen.getByRole('status').textContent).toBe('呼…')
    expect(screen.getByLabelText('桌面宠物').closest('[data-mode]')?.getAttribute('data-mode')).toBe('sleep')
  })

  it('works while the current session runs', () => {
    renderPet(listState(true, true))
    expect(screen.getByRole('status').textContent).toBe('加油！')
  })

  it('idles when the current session is not running', () => {
    renderPet(listState(true, undefined))
    expect(screen.getByRole('status').textContent).toBe('喵？')
  })

  it('pokes through the reaction cycle and reverts to the status bubble', () => {
    vi.useFakeTimers()
    try {
      renderPet(listState(true, false))
      const pet = screen.getByLabelText('桌面宠物')
      fireEvent.click(pet)
      expect(screen.getByRole('status').textContent).toBe(PET_REACTIONS[0])
      fireEvent.click(pet)
      expect(screen.getByRole('status').textContent).toBe(PET_REACTIONS[1])
      act(() => { vi.advanceTimersByTime(700) })
      expect(screen.getByRole('status').textContent).toBe('喵？')
    } finally {
      vi.useRealTimers()
    }
  })
})
