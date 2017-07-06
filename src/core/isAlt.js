/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const hasAlg = require('./hasAlg')
const isFunctor = require('./isFunctor')

// isAlt : a -> Boolean
function isAlt(m) {
  return isFunctor(m)
    && hasAlg('alt', m)
}

module.exports = isAlt
