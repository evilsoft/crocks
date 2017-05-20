/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isFunction = require('./isFunction')

// isSemigroupoid : a -> Boolean
function isSemigroupoid(m) {
  return !!m && isFunction(m.compose)
}

module.exports = isSemigroupoid
