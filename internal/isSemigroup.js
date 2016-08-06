/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isFunction  = require('./isFunction')
const isString    = require('./isString')

// isSemigroup :: a -> Boolean
function isSemigroup(m) {
  return isString(m) || (!!m && isFunction(m.concat))
}

module.exports = isSemigroup
