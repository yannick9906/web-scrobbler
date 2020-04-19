'use strict';

class WebConnector extends BaseConnector {
	constructor() {
		super();

		this.isMediaSessionAllowed = false;

		/**
		 * Selector of an element containing an artist name. Only applies when
		 * default implementation of the `getArtist` method is used.
		 *
		 * @type {String}
		 * @type {Array}
		 */
		this.artistSelector = null;

		/**
		 * Selector of an element containing a track title. Only applies when
		 * default implementation of the `getTrack` method is used.
		 *
		 * @type {String}
		 * @type {Array}
		 */
		this.trackSelector = null;

		/**
		 * Selector of an element containing an album name. Only applies when
		 * default implementation of the `getAlbum` method is used.
		 *
		 * @type {String}
		 * @type {Array}
		 */
		this.albumSelector = null;

		/**
		 * Selector of an element containing an album artist. Only applies when
		 * default implementation of `getAlbumArtist` method is used.
		 *
		 * @type {String}
		 */
		this.albumArtistSelector = null;

		/**
		 * Selector of an element containing track current time in
		 * HH:MM:SS format. Only applies when default implementation of
		 * the `getCurrentTime` method is used.
		 *
		 * @type {String}
		 * @type {Array}
		 */
		this.currentTimeSelector = null;

		/**
		 * Selector of an element containing track remaining time in
		 * HH:MM:SS format. Only applies when default implementation of
		 * the getRemainingTime` method is used.
		 *
		 * Note that the remaining time is not used directly, but is used for
		 * calculating current time or duration (it depends on what is missing
		 * on a website).
		 *
		 * Use this property if the website has either current time or duration.
		 * Do not override this property if the website contains both current
		 * time and duration.
		 *
		 * @type {String}
		 * @type {Array}
		 */
		this.remainingTimeSelector = null;

		/**
		 * Selector of an element containing track duration in HH:MM:SS format.
		 * Only applies when default implementation of the `getDuration`
		 * method is used.
		 *
		 * @type {String}
		 * @type {Array}
		 */
		this.durationSelector = null;

		/**
		 * Selector of an element containing both current time and duration.
		 * `currentTimeSelector` and `durationSelector` properties have priority
		 * over this, and `timeInfoSelector` method is used only if any of
		 * the previous returns empty result.
		 *
		 * Only applies when default implementation of the `getTimeInfo`
		 * method is used.
		 *
		 * @type {String}
		 * @type {Array}
		 */
		this.timeInfoSelector = null;

		/**
		 * Selector of an element containing both artist and track name.
		 *
		 * `artistSelector` and `trackSelector` properties have priority
		 * over this, and `artistTrackSelector` is used only if any of
		 * the previous returns empty result.
		 *
		 * Only applies when default implementation of `getArtistTrack` method
		 * is used.
		 *
		 * @type {String}
		 * @type {Array}
		 */
		this.artistTrackSelector = null;

		/**
		 * Selector of a play button element. If the element is not visible,
		 * the playback is considered to be playing. Only applies when default
		 * implementation of the `isPlaying` method is used.
		 *
		 * Should not be used if the `pauseButtonSelector` property is used.
		 *
		 * @type {String}
		 * @type {Array}
		 */
		this.playButtonSelector = null;

		/**
		 * Selector of a pause button element. If the element is visible,
		 * the playback is considered to be playing. Only applies when default
		 * implementation of the `isPlaying` method is used.
		 *
		 * Should not be used if the `playButtonSelector` property is used.
		 *
		 * @type {String}
		 * @type {Array}
		 */
		this.pauseButtonSelector = null;

		/**
		 * Selector of a container closest to the player. Changes on this
		 * element will be observed and dispatched to `onStateChanged`.
		 *
		 * Set this selector to use with default observing or
		 * set up some custom detection of player state changing.
		 *
		 * @type {String}
		 */
		this.playerSelector = null;

		/**
		 * Selector of element contains a track art of now playing song.
		 * Default implmentation looks for track art URL in `src` attribute or
		 * `background-image` (`background`) CSS property of given element.
		 *
		 * Used for the notification service and "Now playing" popup.
		 *
		 * If not specified will fall back to Last.fm API.
		 *
		 * @type {String}
		 * @type {Array}
		 */
		this.trackArtSelector = null;
	}

	/** @override */
	getArtist() {
		return Util.getTextFromSelectors(this.artistSelector);
	}

	/** @override */
	getTrack() {
		return Util.getTextFromSelectors(this.trackSelector);
	}

	/** @override */
	getAlbum() {
		return Util.getTextFromSelectors(this.albumSelector);
	}

	/** @override */
	getAlbumArtist() {
		return Util.getTextFromSelectors(this.albumArtistSelector);
	}

	/** @override */
	getDuration() {
		return Util.getSecondsFromSelectors(this.durationSelector);
	}

	/** @override */
	getCurrentTime() {
		return Util.getSecondsFromSelectors(this.currentTimeSelector);
	}

	/** @override */
	getRemainingTime() {
		return Util.getSecondsFromSelectors(this.remainingTimeSelector);
	}

	/** @override */
	getTimeInfo() {
		return Util.splitTimeInfo(
			Util.getTextFromSelectors(this.timeInfoSelector)
		);
	}

	/** @override */
	getArtistTrack() {
		return Util.splitArtistTrack(
			Util.getTextFromSelectors(this.artistTrackSelector)
		);
	}

	/** @override */
	getTrackInfo() {
		return null;
	}
}

// eslint-disable-next-line
const Connector = window.Connector || new WebConnector();
