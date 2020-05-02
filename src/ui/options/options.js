'use strict';

const releasesUrl = 'https://github.com/web-scrobbler/web-scrobbler/releases/tag';
const rawSrcUrl = 'https://github.com/web-scrobbler/web-scrobbler/blob/master/src/';

const exportFileName = 'local-cache.json';

define((require) => {
	const browser = require('webextension-polyfill');

	const BrowserStorage = require('storage/browser-storage');
	const Options = require('storage/options');

	const { getPrivacyPolicyFilename } = require('util/util-browser');
	const { getSortedConnectors } = require('util/util-connector');

	const sortedConnectors = getSortedConnectors();
	const localCache = BrowserStorage.getStorage(BrowserStorage.LOCAL_CACHE);

	class OptionsPresenter {
		constructor(view) {
			this.view = view;

			this.setPrivacyPolicyUrl();
			this.setLatestReleaseUrl();
			this.updateSections();

			this.initOptions();
			this.initConnectors();
		}

		/** Public methods. */

		onConnectorCheckBoxClick(index, isChecked) {
			const connector = sortedConnectors[index];
			Options.setConnectorEnabled(connector, isChecked);
		}

		onConnectorOptionCheckBoxClick(connectorLabel, optionId, isChecked) {
			Options.setConnectorOption(connectorLabel, optionId, isChecked);
		}

		async onExportButtonClick() {
			const data = await localCache.get();
			this.view.exportLocalCache(data, exportFileName);
		}

		async onImportButtonClick() {
			this.view.importLocalCache();
		}

		onLocalCacheImported(data) {
			return localCache.set(data);
		}

		onOptionCheckBoxClick(optionId, isChecked) {
			Options.setOption(optionId, isChecked);
		}

		onOptionsContainerClick(e) {
			if (e.altKey) {
				this.view.showHiddenOptions();
			}
		}

		onScroblePercentChanged(percent) {
			Options.setOption(Options.SCROBBLE_PERCENT, percent);
		}

		onToggleCheckBoxClick(isEnabled) {
			Options.setAllConnectorsEnabled(isEnabled);
			this.view.toggleAllConnectors(isEnabled);
		}

		/** Private methods. */

		async initOptions() {
			const percent = await Options.getOption(Options.SCROBBLE_PERCENT);
			this.view.setScrobblePercent(percent);

			const optionIds = [
				Options.DISABLE_GA,
				Options.FORCE_RECOGNIZE,
				Options.USE_NOTIFICATIONS,
				Options.SCROBBLE_PODCASTS,
				Options.USE_UNRECOGNIZED_SONG_NOTIFICATIONS,
			];

			const connectorOptionsIds = {
				Tidal: ['useShortTrackNames'],
				YouTube: ['scrobbleMusicOnly', 'scrobbleEntertainmentOnly'],
			};

			for (const optionId of optionIds) {
				const isChecked = await Options.getOption(optionId);
				this.view.addOptionCheckBox(optionId, isChecked);
			}

			for (const connector in connectorOptionsIds) {
				for (const optionId of connectorOptionsIds[connector]) {
					const isChecked =	await Options.getConnectorOption(connector, optionId);
					this.view.addConnectorOptionCheckBox(connector, optionId, isChecked);
				}
			}
		}

		async initConnectors() {
			const connectorsCount = sortedConnectors.length;
			const disabledConnectors = await Options.getOption(Options.DISABLED_CONNECTORS);
			const toggleCheckboxState = Object.keys(disabledConnectors).length !== connectorsCount;

			sortedConnectors.forEach(({ label, id }, index) => {
				const isEnabled = !(id in disabledConnectors);

				this.view.addConnector(label, index, isEnabled);
			});

			this.view.setToggleCheckBox(toggleCheckboxState);
		}

		async setPrivacyPolicyUrl() {
			const privacyPolicyFile = await getPrivacyPolicyFilename();
			const privacyPolicyUrl = `${rawSrcUrl}/${privacyPolicyFile}`;

			this.view.setPrivacyPolicyUrl(privacyPolicyUrl);
		}

		setLatestReleaseUrl() {
			const extVersion = browser.runtime.getManifest().version;
			const releaseNotesUrl = `${releasesUrl}/v${extVersion}`;

			this.view.setLatestReleaseUrl(releaseNotesUrl);
		}

		updateSections() {
			const map = {
				'#accounts': this.view.expandAccountsSection,
				'#options': this.view.expandOptionsSection,
			};

			const func = map[location.hash];
			if (func) {
				func.bind(this.view)();
			}
		}
	}

	return OptionsPresenter;
});
