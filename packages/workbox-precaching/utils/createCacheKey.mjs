/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import {WorkboxError} from 'workbox-core/_private/WorkboxError.mjs';

import '../_version.mjs';

// Name of the search parameter used to store revision info.
const REVISION_SEARCH_PARAM = '_wbRevision';

/**
 * Converts a manifest entry into a versioned URL suitable for precaching.
 *
 * @param {Object} entry
 * @return {string} A URL with versioning info.
 *
 * @private
 * @memberof module:workbox-precaching
 */
export default function(entry) {
  if (!entry) {
    throw new WorkboxError('add-to-cache-list-unexpected-type', {entry});
  }

  // If a precache manifest entry is a string, it's assumed to be a versioned
  // URL, like '/app.abcd1234.js'. Return as-is.
  if (typeof entry === 'string') {
    const urlObject = new URL(entry, location);
    return {
      cacheKey: urlObject.href,
      url: urlObject.href,
    };
  }

  const {revision, url} = entry;
  if (!url) {
    throw new WorkboxError('add-to-cache-list-unexpected-type', {entry});
  }

  // If there's just a URL and no revision, then it's also assumed to be a
  // versioned URL.
  if (!revision) {
    const urlObject = new URL(url, location);
    return {
      cacheKey: urlObject.href,
      url: urlObject.href,
    };
  }

  // Otherwise, construct a properly versioned URL using the custom Workbox
  // search parameter along with the revision info.
  const originalUrl = new URL(url, location);
  const cacheKeyUrl = new URL(url, location);
  cacheKeyUrl.searchParams.set(REVISION_SEARCH_PARAM, revision);
  return {
    cacheKey: cacheKeyUrl.href,
    url: originalUrl.href,
  };
}