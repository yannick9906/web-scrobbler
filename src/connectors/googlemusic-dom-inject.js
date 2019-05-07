'use strict';

/**
 * Most part of code is from GPM Desktop player project.
 * MarshallOfSound/Google-Play-Music-Desktop-Player-UNOFFICIAL-
 */

const GOOGLE_MINI_PLAYER_EXT_ID = 'fahmaaghhglfmonjliepjlchgpgfmobi';

const PING = 206;
const PONG = 207;
const TRIGGER_CONNECT = 21;
const CONNECTED = 111;
const SYNC = 211;
const SYNC_RESPOND = 305;
const STATUS_UPDATE = 15;

/**
 * This is effectively voodoo, basically we fake being the official
 * Google Play Music Mini Player and receive a whole bunch of handy events.
 */
chrome.runtime = {
	connect(extensionId) {
		function createChannel(label) { // eslint-disable-line
			const fns = [];
			return {
				addListener: (...args) => {
					fns.push(args[0]);
				},
				removeListener: () => {
					// Do nothing
				},
				call: (...args) => fns.forEach((fn) => fn(...args)),
			};
		}

		const onDisconnect = createChannel('onDisconnect');
		const onMessage = createChannel('onMessage');

		// Immediately disconnect if it isn't the connection we're looking for
		if (extensionId !== GOOGLE_MINI_PLAYER_EXT_ID) {
			setTimeout(() => {
				onDisconnect.call();
			}, 0);
		}

		return {
			postMessage(obj) {
				if (extensionId !== GOOGLE_MINI_PLAYER_EXT_ID) {
					return;
				}

				switch (obj.type) {
					case PING:
						onMessage.call({ type: PONG, sentFrom: 'bg' });
						break;
					case TRIGGER_CONNECT:
						onMessage.call({
							type: CONNECTED,
							message: [true, null, false],
							sentFrom: 'bg'
						});
						break;
					case SYNC:
						onMessage.call({
							type: SYNC_RESPOND,
							message: [true, false, 3],
							sentFrom: 'bg'
						});
						break;
					case STATUS_UPDATE: {
						const rawMessage = obj.message[0];
						const rawSongInfo = rawMessage[1] || [];

						let isPlaying = !rawMessage[5];
						if (rawSongInfo.length === 0) {
							isPlaying = false;
						}

						window.postMessage({
							sender: 'web-scrobbler',
							trackInfo: {
								isPlaying,

								track: rawSongInfo[1],
								artist: rawSongInfo[2],
								album: rawSongInfo[3],
								currentTime: rawMessage[2] / 1000,
								duration: rawSongInfo[9] / 1000,
								trackArt: rawSongInfo[10],
								isPodcast: rawSongInfo[14] || false,
							},
						}, '*');
						break;
					}
				}
			},
			onMessage,
			onDisconnect,
		};
	},
};
