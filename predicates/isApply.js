/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isFunction = require('./isFunction')
const isFunctor = require('./isFunctor')

// isApply : a -> Boolean
function isApply(m) {
  return !!m && isFunctor(m) && isFunction(m.ap)
}

module.exports = isApply
