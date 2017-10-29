const debug = require("debug")("devtools-bot");
const cache = require("../utils/cache");

async function search(options, name, searchFn) {
  const shouldCache = "cache" in options ? options.cache : true;

  if (shouldCache) {
    return cache.get("issues");
  }

  let page = 1;
  let results = [];
  let items;

  do {
    debug(`Fetching page ${page}`);
    try {
      items = await searchFn(page);
      if (items.data && items.data.length > 0) {
        results = results.concat(items.data);
      }
    } catch (e) {
      debug(`Failed to fetch page ${page}`);
    } finally {
      page++;
    }
  } while (items.data && items.data.length > 0);

  cache.write("name", results);
  return results;
}

module.exports = search;
