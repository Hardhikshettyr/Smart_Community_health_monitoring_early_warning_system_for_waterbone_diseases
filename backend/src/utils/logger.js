/**
 * Minimal, dependency-free logger. Prefixes every log line with a
 * timestamp and level, and accepts an optional metadata object.
 */

function timestamp() {
  return new Date().toISOString();
}

function info(message, meta = {}) {
  console.log(`[${timestamp()}] [INFO] ${message}`, Object.keys(meta).length ? meta : '');
}

function warn(message, meta = {}) {
  console.warn(`[${timestamp()}] [WARN] ${message}`, Object.keys(meta).length ? meta : '');
}

function error(message, meta = {}) {
  console.error(`[${timestamp()}] [ERROR] ${message}`, Object.keys(meta).length ? meta : '');
}

module.exports = { info, warn, error };