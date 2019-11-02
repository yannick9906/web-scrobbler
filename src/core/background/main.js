/* @ifndef DEBUG
chrome.runtime.onInstalled.addListener((event) => {
	if ('install' !== event.reason) {
		return;
	}
	chrome.tabs.create({
		url: '/ui/startup/startup.html'
	});
});
/* @endif */

/**
 * Background script entry point.
 */

import { Extension } from './extension';
import { migrate } from './util/migrate';

migrate().then(() => {
	new Extension().start();
});
