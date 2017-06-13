/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const _hasAlg = require('../internal/hasAlg')
const isFunctor = require('./isFunctor')

// isTraversable : a -> Boolean
function isTraversable(m) {
  return isFunctor(m)
    && _hasAlg('traverse', m)
}

module.exports = isTraversable
