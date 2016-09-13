/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isFunction = require('./isFunction')

// isApply :: a -> Boolean
function isApply(m) {
  return !!m && isFunction(m.ap) && isFunction(m.map)
}

module.exports = isApply
