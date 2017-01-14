/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isFunction = require('./isFunction')
const isApplicative = require('./isApplicative')

// isMonad : a -> Boolean
function isMonad(m) {
  return !!m
    && isApplicative(m)
    && isFunction(m.chain)
}

module.exports = isMonad

