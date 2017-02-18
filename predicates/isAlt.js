/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isFunction = require('./isFunction')
const isFunctor = require('./isFunctor')

// isAlt : a -> Boolean
function isAlt(m) {
  return !!m
    && isFunctor(m)
    && isFunction(m.alt)
}

module.exports = isAlt
