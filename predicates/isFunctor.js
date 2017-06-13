/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const _hasAlg = require('../internal/hasAlg')

// isFunctor :: a -> Boolean
function isFunctor(m) {
  return !!m && _hasAlg('map', m)
}

module.exports = isFunctor
