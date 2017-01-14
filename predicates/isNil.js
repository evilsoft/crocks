/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

// isNil :: a -> Boolean
function isNil(x) {
  return x === undefined || x === null
}

module.exports = isNil
