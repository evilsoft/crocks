/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isFunction = require('./isFunction')
const isFunctor = require('./isFunctor')

// isExtend : a -> Boolean
function isExtend(m) {
  return isFunctor(m) && isFunction(m.extend)
}

module.exports = isExtend
