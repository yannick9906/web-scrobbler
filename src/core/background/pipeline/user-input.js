/**
 * The pipeline stage applies custom song info data to given song info.
 * Plus, it saves the song info to browser storage.
 */

import * as LocalCacheStorage from 'storage/local-cache';

/**
 * Fill song info by user defined values.
 * @param  {Object} song Song instance
 */
export async function process(song) {
	if (await LocalCacheStorage.fillSongData(song)) {
		song.flags.isCorrectedByUser = true;
	}
}
