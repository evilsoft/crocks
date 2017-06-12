/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const _hasAlg = require('../internal/hasAlg')
const isFunctor = require('./isFunctor')

// isExtend : a -> Boolean
function isExtend(m) {
  return isFunctor(m)
    && _hasAlg('extend', m)
}

module.exports = isExtend
