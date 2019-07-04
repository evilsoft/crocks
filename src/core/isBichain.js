/** @license ISC License (c) copyright 2019 original and current authors */
/** @author Dale Francis (dalefrancis88) */

const hasAlg = require('./hasAlg')

// isBichain : a -> Boolean
function isBichain(m) {
  return hasAlg('bichain', m)
}

module.exports = isBichain
