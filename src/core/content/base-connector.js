'use strict';

/* eslint-disable jsdoc/require-returns-check */

const artistTrackFields = ['artist', 'track'];
const timeInfoFields = ['duration', 'currentTime'];

// @ifdef DEBUG
/**
 * List of song fields used to check if song is changed. If any of
 * these fields are changed, the new song is playing.
 * @type {Array}
 */
const fieldsToCheckSongChange = ['artist', 'track', 'album', 'albumArtist', 'uniqueID'];
// @endif

/**
 * Default values of state properties.
 * @type {Object}
 */
const defaultState = {
	// Required fields.

	/**
	 * Track name.
	 * @type {String}
	 */
	track: null,

	/**
	 * Artist name.
	 * @type {String}
	 */
	artist: null,

	// Optional fields.

	/**
	 * Album name.
	 * @type {String}
	 */
	album: null,

	/**
	 * Album artist.
	 *
	 * @type {String}
	 */
	albumArtist: null,

	/**
	 * Track unique ID.
	 * @type {String}
	 */
	uniqueID: null,

	/**
	 * Track duration.
	 * @type {Number}
	 */
	duration: null,

	/**
	 * Current time.
	 * @type {Number}
	 */
	currentTime: null,

	/**
	 * Playing/pause state.
	 * @type {Boolean}
	 */
	isPlaying: true,

	/**
	 * URL to track art image.
	 * @type {String}
	 */
	trackArt: null,

	/**
	 * Whether the current track is a podcast episode.
	 * @type {String}
	 */
	isPodcast: false,
};

function throwNoImplementedError() {
	throw new Error('Not implemeted');
}

/**
 * Base connector object.
 *
 * Provides properties and functions allow to get track info from a website.
 */
class BaseConnector {
	constructor() {
		/**
		 * Gathered info about the current track for internal use.
		 * @type {Object}
		 */
		this.currentState = Object.assign({}, defaultState);

		/**
		 * Filtered info about the current track for internal use.
		 * @type {Object}
		 */
		this.filteredState = Object.assign({}, defaultState);

		/**
		 * Flag indicates the current state is reset by the connector.
		 * Used to prevent spamming the controller by empty states.
		 *
		 * @type {Boolean}
		 */
		this.isStateReset = false;

		/**
		 * Callback set by the reactor to listen on state changes of this connector.
		 *
		 * @type {Function}
		 */
		this.reactorCallback = null;
	}

	/**
	 * Default getters.
	 *
	 * Priority of getters:
	 * 1) getters (`Connector.getArtist` etc.);
	 * 2) `Connector.getArtistTrack` and `Connector.getTimeInfo`;
	 * 3) `Connector.getTrackInfo`.
	 */

	/**
	 * Return an artist name.
	 *
	 * @return {String} Artist name
	 */
	getArtist() {
		throwNoImplementedError();
	}

	/**
	 * Return a track title.
	 *
	 * @return {String} Track title
	 */
	getTrack() {
		throwNoImplementedError();
	}

	/**
	 * Return an album name.
	 *
	 * @return {String} Album name
	 */
	getAlbum() {
		throwNoImplementedError();
	}

	/**
	 * Return an album artist.
	 *
	 * @return {String} Album artist
	 */
	getAlbumArtist() {
		throwNoImplementedError();
	}

	/**
	 * Return track duration.
	 *
	 * @return {Number} Track duration
	 */
	getDuration() {
		throwNoImplementedError();
	}

	/**
	 * Return current time.
	 *
	 * @return {Number} Current time
	 */
	getCurrentTime() {
		throwNoImplementedError();
	}

	/**
	 * Return remaining time.
	 *
	 * Note that the remaining time is not used directly, but is used for
	 * calculating current time or duration (it depends on what is missing
	 * on a website).
	 *
	 * Use this property if the website has either current time or duration.
	 * Do not override this property if the website contains both current time
	 * and duration.
	 *
	 * @return {Number} Remaining time
	 */
	getRemainingTime() {
		throwNoImplementedError();
	}

	/**
	 * Return an object contains both current time and duration.
	 *
	 * @return {Object} Object contains current time and duration info
	 */
	getTimeInfo() {
		throwNoImplementedError();
	}

	/**
	 * Return an object contains both artist name and track title.
	 *
	 * @return {Object} Object contain artist and track information
	 */
	getArtistTrack() {
		throwNoImplementedError();
	}

	/**
	 * Get object contains track info. See documentation of `defaultState`
	 * variable for supported properties.
	 *
	 * Use this function to get several properties from a single source
	 * per one call.
	 *
	 * @return {Object} Object contains track info
	 */
	getTrackInfo() {
		throwNoImplementedError();
	}

	/**
	 * Returns a unique identifier of current track.
	 *
	 * @return {String} Unique ID
	 */
	getUniqueID() {
		throwNoImplementedError();
	}

	/**
	 * Return a URL to track art.
	 *
	 * @return {String} Track art URL
	 */
	getTrackArt() {
		throwNoImplementedError();
	}

	getOriginUrl() {
		throwNoImplementedError();
	}

	/** Public functions. */

	/**
	 * Check if a now playing song is playing actually.
	 *
	 * @return {Boolean} True if song is now playing; false otherwise
	 */
	isPlaying() {
		throwNoImplementedError();
	}

	/**
	 * Default implementation to check whether a podcast is playing. Only has an
	 * effect if the user has opted to disable podcast scrobbling.
	 *
	 * @return {Boolean} True if the current track is a podcast; false otherwise
	 */
	isPodcast() {
		throwNoImplementedError();
	}

	isStateChangeAllowed() {
		throwNoImplementedError();
	}

	isScrobblingAllowed() {
		throwNoImplementedError();
	}

	/**
	 * Listener for the player state changes. Automatically detects the state,
	 * collects the track metadata and communicates with the background script
	 * if needed.
	 */
	onStateChanged() {
		if (!this.isStateChangeAllowed()) {
			return;
		}

		/**
		 * Because gathering the state from DOM is quite expensive and mutation
		 * events can be emitted REALLY often, we use throttle to set a minimum
		 * delay between two calls of the state change listener.
		 *
		 * Only exception is change in pause/play state which we detect
		 * immediately so we don't miss a quick play/pause/play or
		 * pause/play/pause sequence.
		 */
		const isPlaying = this.isPlaying();
		if (isPlaying !== this.currentState.isPlaying) {
			this.processStateChanged();
		} else {
			this.stateChangedWorkerThrottled();
		}
	}

	/** Private functions. */

	getCurrentState() {
		const emptyState = {};
		return this.getStateViaGetters(emptyState);
	}

	getStateViaGetters(/* currentState */) {
		// TODO Fill only missing properties.

		const newState = {
			albumArtist: this.getAlbumArtist(),
			uniqueID: this.getUniqueID(),
			duration: this.getDuration(),
			currentTime: this.getCurrentTime(),
			isPlaying: this.isPlaying(),
			isPodcast: this.isPodcast(),
			originUrl: this.getOriginUrl(),
			trackArt: this.getTrackArt(),
			artist: this.getArtist(),
			track: this.getTrack(),
			album: this.getAlbum(),
		};

		const remainingTime = Math.abs(this.getRemainingTime());
		if (remainingTime) {
			if (!newState.currentTime && newState.duration) {
				newState.currentTime = newState.duration - remainingTime;
			}

			if (!newState.duration && newState.currentTime) {
				newState.duration = newState.currentTime + remainingTime;
			}
		}

		const timeInfo = this.getTimeInfo();
		Util.fillEmptyFields(newState, timeInfo, timeInfoFields);

		const artistTrack = this.getArtistTrack();
		Util.fillEmptyFields(newState, artistTrack, artistTrackFields);

		const trackInfo = this.getTrackInfo();
		Util.fillEmptyFields(newState, trackInfo, Object.keys(defaultState));

		return newState;
	}

	/**
	 * Function for all the hard work around detecting and updating state.
	 */
	processStateChange() {
		if (!this.isScrobblingAllowed()) {
			this.resetState();
			return;
		}

		this.isStateReset = false;

		const changedFields = [];
		const newState = this.getCurrentState();

		for (const key in this.currentState) {
			let newValue;
			if (newState[key] || newState[key] === false) {
				newValue = newState[key];
			} else {
				newValue = defaultState[key];
			}
			const oldValue = this.currentState[key];

			if (newValue !== oldValue) {
				this.currentState[key] = newValue;
				changedFields.push(key);
			}
		}

		if (changedFields.length > 0) {
			this.filterState(changedFields);

			if (this.reactorCallback !== null) {
				this.reactorCallback(this.filteredState, changedFields);
			}

			// @ifdef DEBUG
			if (changedFields.includes('isPlaying')) {
				Util.debugLog(`isPlaying state changed to ${newState.isPlaying}`);
			}

			for (const field of fieldsToCheckSongChange) {
				if (changedFields.includes(field)) {
					Util.debugLog(JSON.stringify(this.filteredState, null, 2));
					break;
				}
			}
			// @endif
		}
	}

	/**
	 * Filter changed fields.
	 * @param  {Array} changedFields List of changed fields
	 */
	// filterState(changedFields) {
	// 	for (const field of changedFields) {
	// 		let fieldValue = this.currentState[field];

	// 		switch (field) {
	// 			case 'albumArtist': {
	// 				if (fieldValue === this.currentState.artist) {
	// 					fieldValue = defaultState[field];
	// 				}
	// 			}
	// 			// eslint-disable-next-line no-fallthrough
	// 			case 'artist':
	// 			case 'track':
	// 			case 'album': {
	// 				fieldValue = this.metadataFilter.filterField(field, fieldValue) || defaultState[field];
	// 				break;
	// 			}
	// 			case 'currentTime':
	// 			case 'duration': {
	// 				fieldValue = Util.escapeBadTimeValues(fieldValue) || defaultState[field];
	// 				break;
	// 			}
	// 			case 'trackArt':
	// 				if (this.isTrackArtDefault(fieldValue)) {
	// 					fieldValue = null;
	// 				}
	// 				break;
	// 		}

	// 		this.filteredState[field] = fieldValue;
	// 	}
	// }
}

// @ifdef DEBUG
/**
 * Export Connector object if script is executed in Node.js context.
 */
if (typeof module !== 'undefined') {
	module.exports = BaseConnector;
}
// @endif
