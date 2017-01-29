/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isFunction = require('./isFunction')

// isFoldable : a -> Boolean
function isFoldable(m) {
  return !!m
    && isFunction(m.reduce)
}

module.exports = isFoldable
