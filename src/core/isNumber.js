/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

// isNumber : a -> Boolean
function isNumber(x) {
  return typeof x === 'number'
    && !isNaN(x)
}

module.exports = isNumber
