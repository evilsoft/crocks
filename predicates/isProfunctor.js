/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const _hasAlg = require('../internal/hasAlg')
const isContravariant = require('./isContravariant')
const isFunctor = require('./isFunctor')

// isProfunctor : a -> Boolean
function isProfunctor(m) {
  return isFunctor(m)
    && isContravariant(m)
    && _hasAlg('promap', m)
}

module.exports = isProfunctor
