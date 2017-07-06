/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const hasAlg = require('./hasAlg')

// isSemigroupoid : a -> Boolean
function isSemigroupoid(m) {
  return !!m && hasAlg('compose', m)
}

module.exports = isSemigroupoid
