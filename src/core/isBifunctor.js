/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const hasAlg = require('./hasAlg')
const isFunctor = require('./isFunctor')

/** isBifunctor :: a -> Boolean */
function isBifunctor(m) {
  return isFunctor(m)
    && hasAlg('bimap', m)
}

module.exports = isBifunctor
