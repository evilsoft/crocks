/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const hasAlg = require('./hasAlg')

// isBichain : a -> Boolean
function isBichain(m) {
  return hasAlg('bichain', m)
}

module.exports = isBichain
