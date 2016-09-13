/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isString = require('./isString')
const isFunction = require('./isFunction')

// isSemigroup :: a -> Boolean
function isSemigroup(m) {
  return isString(m) || (!!m && isFunction(m.concat))
}

module.exports = isSemigroup
