/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const _hasAlg = require('../internal/hasAlg')
const isFunctor = require('./isFunctor')

// isBifunctor : a -> Boolean
function isBifunctor(m) {
  return isFunctor(m)
    && _hasAlg('bimap', m)
}

module.exports = isBifunctor
