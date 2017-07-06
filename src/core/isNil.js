/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

// isNil : a -> Boolean
function isNil(x) {
  return x === undefined
    || x === null
    || Number.isNaN(x)
}

module.exports = isNil
