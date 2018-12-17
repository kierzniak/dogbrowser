import config from "./../config";
import { splitToChunks } from "./array.js";

/**
 * Preload image from URL.
 *
 * @param {string} url - Image URL.
 *
 * @returns {Promise} Promise of loaded image.
 */
function preload(url) {
  return new Promise(function(resolve, reject) {
    let img;

    img = new Image();

    img.onload = resolve;
    img.onerror = resolve;

    img.src = url;
  });
}

/**
 * Preload images from array of urls.
 *
 * @param {string[]} urls - Array of URLs.
 *
 * @returns {Promise[]} Array of promises of loaded images.
 */
function preloadArray(urls) {
  let promises = [];

  for (let i = 0; i < urls.length; i++) {
    promises[i] = preload(urls[i]);
  }

  return Promise.all(promises);
}

/**
 * Preload images from array of photo object.
 *
 * @param {Object[]} photos - Array of photo objects.
 *
 * @returns {Promise[]} Array of promises of loaded images.
 */
function preloadPhotos(photos) {
  // Prepare array of urls for preloading function
  let urls = photos.map(p => p.url);

  // Preload urls
  return preloadArray(urls);
}

/**
 * Preload images from array of photo object in chunks.
 *
 * @param {Object[]} photos - Array of photo objects.
 * @param {Function} callbackItem - Callback exucted when one chunk is loaded.
 * @param {Function} callbackAll - Callback exucted when all chunks are loaded.
 *
 * @returns {void} Returns nothing.
 */
async function preloadPhotosInChunks(photos, callbackItem, callbackAll) {
  // Split array into smaller chunks of `config.preloadCount` elements to
  // preload photos.
  let chunks = splitToChunks(photos, config.preloadCount);

  let all = chunks.map(
    async function(chunk) {
      // Preload urls
      await preloadPhotos(chunk);

      // Execute one chunk callback
      callbackItem.call(this, chunk, chunks);
    }.bind(this)
  );

  // Execute all chunks callback
  callbackAll.call(this, await Promise.all(all));
}

export default preloadPhotosInChunks;
