/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isFunction = require('./isFunction')

// isFunctor :: a -> Boolean
function isFunctor(m) {
  return !!m && isFunction(m.map)
}

module.exports = isFunctor
