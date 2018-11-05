/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

/* eslint eqeqeq: "off" */

// isNil : a -> Boolean
function isNil(x) {
  return x == null || x !== x
}

module.exports = isNil
