/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isFunction = require('./isFunction')

// isType :: Container m => String -> m -> Boolean
function isType(type, m) {
  return isFunction(m.type) && type === m.type()
}

module.exports = isType
