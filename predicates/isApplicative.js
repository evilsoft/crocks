/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isFunction = require('./isFunction')
const isApply = require('./isApply')

// isApplicative : a -> Boolean
function isApplicative(m) {
  return !!m
    && isApply(m)
    && isFunction(m.of)
}

module.exports = isApplicative
