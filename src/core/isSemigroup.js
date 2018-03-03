/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isString = require('./isString')
const hasAlg = require('./hasAlg')

// isSemigroup : a -> Boolean
function isSemigroup(m) {
  return isString(m)
    || !!m && hasAlg('concat', m)
}

module.exports = isSemigroup
