/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isNumber = require('./isNumber')

// isInteger : a -> Boolean
function isInteger(x) {
  return isNumber(x)
    && isFinite(x)
    && Math.floor(x) === x
}

module.exports = isInteger
