/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const _hasAlg = require('../internal/hasAlg')
const isSemigroup = require('./isSemigroup')

// isMonoid :: a -> Boolean
function isMonoid(m) {
  return isSemigroup(m)
    && _hasAlg('empty', m)
}

module.exports = isMonoid
