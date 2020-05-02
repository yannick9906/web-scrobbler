'use strict';

const privacyLinkId = 'privacy-url';
const latestReleaseLinkId = 'latest-release';

const accountsSectionId = 'collapseAccounts';
const contactsSectionId = 'collapseContacts';
const optionsSectionId = 'collapseOptions';

const hiddenOptionsId = 'hidden-options';

const exportBtnId = 'export-edited';
const importBtnId = 'import-edited';

const scrobblePercentId = 'scrobblePercent';

const connectorsContainerId = 'connectors';

const percentValues = [
	10, 20, 30, 40, 50, 60, 70, 80, 90, 100
];

class OptionsView {
	constructor() {
		this.presenter = this.getPresenter();
		this.connectors = document.getElementById(connectorsContainerId);

		this.initComponents();
	}

	/**
	 * Methods must be implemented.
	 */

	getPresenter() {
		throw new Error('No implementation!');
	}

	/** Public methods. */

	addOptionCheckBox(optionId, isChecked) {
		const optionCheckBox = document.getElementById(optionId);
		optionCheckBox.checked = isChecked;
		optionCheckBox.addEventListener('click', () => {
			this.presenter.onOptionCheckBoxClick(
				optionId, optionCheckBox.checked);
		});
	}

	addConnectorOptionCheckBox(connectorLabel, optionId, isChecked) {
		const optionCheckBox = document.getElementById(optionId);
		optionCheckBox.checked = isChecked;
		optionCheckBox.addEventListener('click', () => {
			this.presenter.onConnectorOptionCheckBoxClick(
				connectorLabel, optionId, optionCheckBox.checked);
		});
	}

	addConnector(label, index, isEnabled) {
		const entry = OptionsView.createConnectorEntry(index, label);

		const checkbox = entry.getElementsByTagName('input')[0];
		checkbox.addEventListener('click', () => {
			this.presenter.onConnectorCheckBoxClick(index, checkbox.checked);
		});
		checkbox.checked = isEnabled;

		this.connectors.appendChild(entry);
	}

	expandAccountsSection() {
		this.expandSection(accountsSectionId);
		this.collapseSection(contactsSectionId);
	}

	expandOptionsSection() {
		this.expandSection(optionsSectionId);
		this.collapseSection(contactsSectionId);
	}

	exportLocalCache(data, fileName) {
		const dataStr = JSON.stringify(data, null, 2);
		const blob = new Blob([dataStr], { 'type': 'application/octet-stream' });
		const url = URL.createObjectURL(blob);

		const a = document.createElement('a');
		a.href = url;
		a.download = fileName;
		a.dispatchEvent(new MouseEvent('click'));
		a.remove();

		URL.revokeObjectURL(url);
	}

	importLocalCache() {
		const fileInput = document.createElement('input');

		fileInput.style.display = 'none';
		fileInput.type = 'file';
		fileInput.accept = '.json';
		fileInput.acceptCharset = 'utf-8';

		document.body.appendChild(fileInput);
		fileInput.initialValue = fileInput.value;
		fileInput.onchange = () => {
			if (fileInput.value !== fileInput.initialValue) {
				const file = fileInput.files[0];

				const reader = new FileReader();
				reader.onloadend = (event) => {
					const dataStr = event.target.result;
					const data = JSON.parse(dataStr);

					this.presenter.onLocalCacheImported(data).then(() => {
						fileInput.remove();
					});
				};
				reader.readAsText(file, 'utf-8');
			}
		};
		fileInput.click();
	}

	setScrobblePercent(percent) {
		const scrobblePercentElem = document.getElementById(scrobblePercentId);
		scrobblePercentElem.selectedIndex = percentValues.indexOf(percent);
	}

	setToggleCheckBox(isChecked) {
		const toggleCheckBox = document.getElementById('toggle');
		toggleCheckBox.checked = isChecked;
		toggleCheckBox.addEventListener('click', () => {
			this.presenter.onToggleCheckBoxClick(toggleCheckBox.checked);
		});
	}

	setPrivacyPolicyUrl(url) {
		this.setUrl(privacyLinkId, url);
	}

	setLatestReleaseUrl(url) {
		this.setUrl(latestReleaseLinkId, url);
	}

	showHiddenOptions() {
		document.getElementById(hiddenOptionsId).hidden = false;
	}

	toggleAllConnectors(isChecked) {
		const checkBoxes = this.connectors.getElementsByTagName('input');
		for (const checkBox of checkBoxes) {
			checkBox.checked = isChecked;
		}
	}

	/** Private methods. */

	initComponents() {
		const exportButton = document.getElementById(exportBtnId);
		const importButton = document.getElementById(importBtnId);

		exportButton.addEventListener('click', (e) => {
			e.preventDefault();
			this.presenter.onExportButtonClick();
		});

		importButton.addEventListener('click', (e) => {
			e.preventDefault();
			this.presenter.onImportButtonClick();
		});

		const optionsContainer = document.getElementById(optionsSectionId);
		optionsContainer.addEventListener('click', (event) => {
			this.presenter.onOptionsContainerClick(event);
		});

		const scrobblePercentElem = document.getElementById(scrobblePercentId);
		for (const val of percentValues) {
			const percentOption = document.createElement('option');
			percentOption.textContent = `${val}%`;

			scrobblePercentElem.appendChild(percentOption);
		}
		scrobblePercentElem.addEventListener('change', () => {
			const percent = percentValues[scrobblePercentElem.selectedIndex];
			this.presenter.onScroblePercentChanged(percent);
		});
	}

	setUrl(id, url) {
		const element = document.getElementById(id);
		element.setAttribute('href', url);
	}

	collapseSection(sectionId) {
		document.getElementById(sectionId).classList.remove('show');
	}

	expandSection(sectionId) {
		document.getElementById(sectionId).classList.add('show');
	}

	// static createOptionCheckBox(optionId, description, title) {
	// 	const input = document.createElement('input');
	// 	input.className = 'form-check-input';
	// 	input.type = 'checkbox';
	// 	input.id = optionId;

	// 	const label = document.createElement('label');
	// 	label.className = 'form-check-label';
	// 	label.for = optionId;
	// 	label.setAttribute('i18n', description);
	// 	label.setAttribute('i18n-title', title);

	// 	const container = document.createElement('div');
	// 	container.className = 'form-check';
	// 	container.appendChild(input);
	// 	container.appendChild(label);

	// 	return container;
	// }

	static createConnectorEntry(index, label) {
		const configId = OptionsView.getConnectorConfigId(index);

		const icon = document.createElement('i');
		icon.classList.add('fa', 'fa-cog');

		const configLink = document.createElement('a');
		configLink.setAttribute('href', '#conn-conf-modal');
		configLink.setAttribute('data-conn', index);
		configLink.setAttribute('data-toggle', 'modal');
		configLink.append(icon);

		const configCheckBox = document.createElement('input');
		configCheckBox.setAttribute('type', 'checkbox');
		configCheckBox.id = configId;

		const configLabel = document.createElement('label');
		configLabel.setAttribute('for', configId);
		configLabel.classList.add('form-check-label');
		configLabel.textContent = label;

		const container = document.createElement('div');
		container.classList.add('connector-config');
		container.append(configLink, configCheckBox, configLabel);

		return container;
	}

	static getConnectorConfigId(index) {
		return `conn-${index}`;
	}
}

define(() => OptionsView);
