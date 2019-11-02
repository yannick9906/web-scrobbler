import 'bootstrap';

import * as browser from 'webextension-polyfill';
import * as Util from 'util/util-browser';

import * as Accounts from 'options/accounts';
import * as Connectors from 'options/connectors';
import * as Dialogs from 'options/dialogs';
import * as Options from 'options/options';
import * as Export from 'options/export';

const GITHUB_RELEASES_URL =
	'https://github.com/web-scrobbler/web-scrobbler/releases/tag';
const GITHUB_RAW_SRC =
	'https://github.com/web-scrobbler/web-scrobbler/blob/master/src/';

const accountsSectionId = 'collapseAccounts';
const contactsSectionId = 'collapseContacts';
const optionsSectionId = 'collapseOptions';

const latestReleaseLinkId = 'latest-release';
const privacyLinkId = 'privacy-url';

async function initialize() {
	await Promise.all([
		Connectors.initialize(),
		Accounts.initialize(),
		Dialogs.initialize(),
		Options.initialize(),
		Export.initialize(),
	]);

	updateSections();
	updateUrls();
}

async function updateSections() {
	switch (location.hash) {
		case '#accounts':
			expandAccountsSection();
			break;
		case '#options':
			expandOptionsSection();
			break;
	}
}

async function updateUrls() {
	/* GitHub releases URL */

	const extVersion = browser.runtime.getManifest().version;
	const releaseNotesUrl = `${GITHUB_RELEASES_URL}/v${extVersion}`;

	const latestReleaseLink = document.getElementById(latestReleaseLinkId);
	latestReleaseLink.setAttribute('href', releaseNotesUrl);

	/* Privacy policy URL */

	const privacyPolicyFile = await Util.getPrivacyPolicyFilename();
	const privacyPolicyUrl = `${GITHUB_RAW_SRC}/${privacyPolicyFile}`;

	const privacyLink = document.getElementById(privacyLinkId);
	privacyLink.setAttribute('href', privacyPolicyUrl);
}

function expandAccountsSection() {
	expandSection(accountsSectionId);
	collapseSection(contactsSectionId);
}

function expandOptionsSection() {
	expandSection(optionsSectionId);
	collapseSection(contactsSectionId);
}

function collapseSection(sectionId) {
	document.getElementById(sectionId).classList.remove('show');
}

function expandSection(sectionId) {
	document.getElementById(sectionId).classList.add('show');
}

initialize();
