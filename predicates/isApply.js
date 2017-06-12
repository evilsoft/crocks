/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const _hasAlg = require('../internal/hasAlg')
const isFunctor = require('./isFunctor')

// isApply : a -> Boolean
function isApply(m) {
  return isFunctor(m)
    && _hasAlg('ap', m)
}

module.exports = isApply
