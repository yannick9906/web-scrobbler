/**
 * A connector is ready to scrobble tracks.
 *
 * @type {String}
 */
export const Base = 'Base';

/**
 * A connector attached to a controller is disabled by a user.
 *
 * @type {String}
 */
export const Disabled = 'Disabled';

/**
 * A scrobble service returned an error.
 *
 * @type {String}
 */
export const Err = 'Error';

/**
 * A song was ignored by a scrobble service.
 *
 * @type {String}
 */
export const Ignored = 'Ignored';

/**
 * A song info is being loaded.
 *
 * @type {String}
 */
export const Loading = 'Loading';

/**
 * A song is now playing.
 *
 * @type {String}
 */
export const Playing = 'Playing';

/**
 * A song is scrobbled.
 *
 * @type {String}
 */
export const Scrobbled = 'Scrobbled';

/**
 * A user skipped a song.
 *
 * @type {String}
 */
export const Skipped = 'Skipped';

/**
 * An unknown song is playing.
 *
 * @type {String}
 */
export const Unknown = 'Unknown';

/**
 * A list of inactive modes.
 *
 * If a mode is not in this list, it means an active mode.
 *
 * @type {Array}
 */
const inactiveModes = [Base, Disabled];

/**
 * Check if a given mode is active.
 *
 * @param  {String} mode Mode instance
 * @return {Boolean} True if the mode is active; false otherwise
 */
export function isActiveMode(mode) {
	return !inactiveModes.includes(mode);
}

/**
 * Check if a given mode is inactive.
 *
 * @param  {String} mode Mode instance
 * @return {Boolean} True if the mode is inactive; false otherwise
 */
export function isInactiveMode(mode) {
	return inactiveModes.includes(mode);
}
