/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isFunction = require('./isFunction')
const isFunctor = require('./isFunctor')

// isTraversable : a -> Boolean
function isTraversable(m) {
  return !!m
    && isFunctor(m)
    && isFunction(m.traverse)
}

module.exports = isTraversable
