/**
 * Module that contains all migrate code.
 */

import * as BrowserStorage from 'storage/browser-storage';

import * as connectors from 'connectors';
import * as Options from 'storage/options';
import * as Util from 'util/util';

/**
 * Perform a migration.
 */
export async function migrate() {
	await migrateConnectorOptions();
	await migrateGooglePlayPodcastOption();
}

async function migrateConnectorOptions() {
	const disabledConnectors =
		await Options.getOption(Options.DISABLED_CONNECTORS);

	if (!Array.isArray(disabledConnectors)) {
		return;
	}

	const disabledConnectorsNew = {};

	for (const label of disabledConnectors) {
		for (const connector of connectors) {
			if (connector.label === label) {
				disabledConnectorsNew[connector.id] = true;
			}
		}
	}

	await Options.setOption(
		Options.DISABLED_CONNECTORS, disabledConnectorsNew);

	Util.debugLog('Updated disabled connectors');
}

async function migrateGooglePlayPodcastOption() {
	const optionsStorage = BrowserStorage.getStorage(BrowserStorage.CONNECTORS_OPTIONS);
	const optionsData = await optionsStorage.get();

	if (optionsData.GoogleMusic !== undefined) {
		const scrobblePodcasts = optionsData.GoogleMusic.scrobblePodcasts;
		await Options.setOption(Options.SCROBBLE_PODCASTS, scrobblePodcasts);

		delete optionsData['GoogleMusic'];
		await optionsStorage.set(optionsData);

		Util.debugLog('Migrated Google Play Music podcast scrobbling setting to global context');
	}
}
