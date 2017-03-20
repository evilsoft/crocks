/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isFunction = require('./isFunction')

// isMonoid :: a -> Boolean
function isMonoid(m) {
  return !!m
    && isFunction(m.empty)
}

module.exports = isMonoid
