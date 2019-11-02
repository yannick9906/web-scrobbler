const { connectors } = require('connectors');
const UrlMatch = require('util/url-match');

const { getAllPatterns } = require('storage/custom-patterns');

export async function getConnectorByUrl(url) {
	const customPatterns = await getAllPatterns();
	for (const connector of connectors) {
		let patterns = connector.matches || [];

		if (customPatterns[connector.id]) {
			patterns = patterns.concat(customPatterns[connector.id]);
		}

		for (const pattern of patterns) {
			if (UrlMatch.test(url, pattern)) {
				return connector;
			}
		}
	}

	return null;
}

export function getConnectorById(connectorId) {
	for (const connector of connectors) {
		if (connector.id === connectorId) {
			return connector;
		}
	}

	return null;
}

/**
 * Return a sorted array of connectors.
 * @return {Array} Array of connectors
 */
export function getSortedConnectors() {
	return connectors.slice(0).sort((a, b) => {
		return a.label.localeCompare(b.label);
	});
}
