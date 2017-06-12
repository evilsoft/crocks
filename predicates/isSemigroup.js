/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isString = require('./isString')
const _hasAlg = require('../internal/hasAlg')

// isSemigroup : a -> Boolean
function isSemigroup(m) {
  return isString(m)
    || (!!m && _hasAlg('concat', m))
}

module.exports = isSemigroup
