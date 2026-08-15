/**
 * The desktop pet overlay: a floating cat docked at the frame's bottom-right
 * corner. Mode derives from the sessions-list standard feed (sleep without a
 * current session, working while the current session runs, idle otherwise);
 * clicking pokes the pet into a short reaction bubble. All state is local and
 * presentation-only — nothing reaches the session log.
 */
import { useEffect, useMemo, useState } from 'react'
import type { PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import { bubbleText, derivePetMode, reactionFor } from './pet-state.ts'
import css from './PetOverlay.module.css'

/** How long a poke reaction bubble stays up. */
const REACTION_MS = 700

/** The pet's accessible name. */
const PET_LABEL = '桌面宠物'

/**
 * The `shell.overlay` list entry: the floating pet and its status bubble.
 * @param props - the slot runtime share; only the global sessions feed is read.
 */
export function PetOverlay({ useSessions }: PropsRuntime<'shell.overlay'>) {
  const current = useSessions(state => state.current)
  const running = useSessions(state =>
    state.current === undefined ? false : (state.byId[state.current]?.running ?? false))
  const mode = useMemo(
    () => derivePetMode({ hasCurrentSession: current !== undefined, running }),
    [current, running],
  )
  const [pokes, setPokes] = useState(0)
  const [reacting, setReacting] = useState(false)

  useEffect(() => {
    if (!reacting) return
    const timer = setTimeout(() => { setReacting(false) }, REACTION_MS)
    return () => { clearTimeout(timer) }
  }, [reacting, pokes])

  const text = reacting ? reactionFor(pokes) : bubbleText(mode)

  return (
    <div className={css.pet} data-mode={mode} data-poking={reacting || undefined}>
      <span className={css.bubble} role="status">{text}</span>
      <button
        type="button"
        className={css.petBody}
        aria-label={PET_LABEL}
        title={text}
        onClick={() => {
          setPokes(count => count + 1)
          setReacting(true)
        }}
      >
        {/* The key restarts the CSS animation per poke and per mode change. */}
        <span className={css.face} key={reacting ? `poke-${pokes}` : mode} aria-hidden="true">🐈</span>
      </button>
    </div>
  )
}
