/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const _hasAlg = require('../internal/hasAlg')

// isSemigroupoid : a -> Boolean
function isSemigroupoid(m) {
  return !!m && _hasAlg('compose', m)
}

module.exports = isSemigroupoid
