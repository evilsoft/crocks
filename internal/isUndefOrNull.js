/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

// isUndefOrNull :: a -> Boolean
function isUndefOrNull(x) {
  return x === undefined || x === null
}

module.exports = isUndefOrNull
