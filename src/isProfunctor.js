/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const hasAlg = require('./core/hasAlg')
const isContravariant = require('./core/isContravariant')
const isFunctor = require('./core/isFunctor')

// isProfunctor : a -> Boolean
function isProfunctor(m) {
  return isFunctor(m)
    && isContravariant(m)
    && hasAlg('promap', m)
}

module.exports = isProfunctor
