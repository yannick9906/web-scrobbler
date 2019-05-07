'use strict';

let currentState = {};

Connector.isScrobblingAllowed = () => Connector.getArtist() !== 'Subscribe to go ad-free';

Connector.isPlaying = () => currentState.isPlaying;

Connector.getCurrentState = () => currentState;

Connector.onScriptEvent = (event) => {
	currentState = event.data.trackInfo;
	Connector.onStateChanged();
};

Connector.isPodcast = () => $('#player .now-playing-actions').hasClass('podcast');

Connector.injectScript('connectors/googlemusic-dom-inject.js');
