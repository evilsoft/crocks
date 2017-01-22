/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isFunction = require('./isFunction')

// isSetoid : a -> Boolean
function isSetoid(m) {
  return !!m && isFunction(m.equals)
}

module.exports = isSetoid

