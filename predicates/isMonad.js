/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const _hasAlg = require('../internal/hasAlg')
const isApplicative = require('./isApplicative')

// isMonad : a -> Boolean
function isMonad(m) {
  return isApplicative(m)
    && _hasAlg('chain', m)
}

module.exports = isMonad

