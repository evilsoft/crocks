/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const _hasAlg = require('../internal/hasAlg')

// isFoldable : a -> Boolean
function isFoldable(m) {
  return !!m
    && _hasAlg('reduce', m)
}

module.exports = isFoldable
