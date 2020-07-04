const CACHE = {};
const timeouts = {};
const TIMEOUT = 10000;
window.cache = function(name, value) {
  CACHE[name] = value;
  resetTimeout(name);
};
window.loadCached = function(name) {
  if (CACHE[name] !== undefined) {
    e('CACHE', name, CACHE[name]);
    resetTimeout(name);
    return CACHE[name];
  }
  else return undefined;
};
window.clearCache = function(name) {
  delete(CACHE[name]);
};

function resetTimeout(name) {
  if (timeouts[name]) clearTimeout(timeouts[name]);
  timeouts[name] = setTimeout(() => {clearCache(name)}, TIMEOUT);
}