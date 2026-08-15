/**
 * Web desktop-pet plugin, node half.
 *
 * Deliberately empty. The pet is browser-only presentation chrome: its mode
 * derives from the client sessions list, and nothing it draws or reads enters
 * the session log, so there is no host service, tool, or event to own here.
 */

/** Host plugin body — the pet lives entirely in the browser half. */
export function apply(): void {}
