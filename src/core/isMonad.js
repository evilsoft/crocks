/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const hasAlg = require('./hasAlg')
const isApplicative = require('./isApplicative')

// isMonad : a -> Boolean
function isMonad(m) {
  return isApplicative(m)
    && hasAlg('chain', m)
}

module.exports = isMonad

