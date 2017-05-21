/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isFunction = require('./isFunction')

// isCategory : a -> Boolean
function isCategory(m) {
  return !!m
    && isFunction(m.compose)
    && isFunction(m.id)
}

module.exports = isCategory
