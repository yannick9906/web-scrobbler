import * as BrowserStorage from 'storage/browser-storage';

const storage = BrowserStorage.getStorage(BrowserStorage.CUSTOM_PATTERNS);

/**
 * Get custom patterns for all connectors.
 * @return {Object} Custom URL patterns
 */
export function getAllPatterns() {
	return storage.get();
}

/**
 * Update custom patterns and save them to storage.
 * @param {String} connectorId Connector ID
 * @param {Array} patterns Array of custom URL patterns
 */
export async function setPatterns(connectorId, patterns) {
	const data = await storage.get();

	data[connectorId] = patterns;
	await storage.set(data);
}

/**
 * Remove custom URL patterns for given connector.
 * @param {String} connectorId Connector ID
 */
export async function resetPatterns(connectorId) {
	const data = await storage.get();

	delete data[connectorId];
	await storage.set(data);
}
