/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const hasAlg = require('./hasAlg')
const isContravariant = require('./isContravariant')
const isFunctor = require('./isFunctor')

// isProfunctor :: a -> Boolean
function isProfunctor(m) {
  return isContravariant(m)
    && isFunctor(m)
    && hasAlg('promap', m)
}

module.exports = isProfunctor
