/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const hasAlg = require('../core/hasAlg')
const isFunctor = require('../core/isFunctor')

// isTraversable : a -> Boolean
function isTraversable(m) {
  return isFunctor(m)
    && hasAlg('traverse', m)
}

module.exports = isTraversable
