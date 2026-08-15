/**
 * Package-owned invariant companion for `dsh-ui-pet`.
 * @module dsh-ui-pet/invariant
 */

/* jscpd:ignore-start */
import type { Context } from '@deepseek-ai/cordis'
import type { InvariantInstaller } from '@deepseek-ai/dsh-invariants'

const PACKAGE_NAME = 'dsh-ui-pet'

/** Cordis companion plugin name. */
export const name = 'dsh-ui-pet-invariant'
/** Service required before the companion can reserve package ownership. */
export const inject = ['invariants']

/**
 * No runtime invariant: the pet is one effect-owned registration in the
 * frame-declared `shell.overlay` list slot; registration and disposal are the
 * slot registry's own audited behavior, and the component reads only the
 * `useSessions` standard feed.
 */
const install: InvariantInstaller = () => {}

/**
 * Register this package's invariant companion.
 * @param ctx - Cordis context carrying the invariant service.
 * @returns The installed registration's disposer after setup succeeds.
 */
export const apply = (ctx: Context): Promise<() => void> =>
  Promise.resolve(ctx.invariants.register(PACKAGE_NAME, install))
/* jscpd:ignore-end */

