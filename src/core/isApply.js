/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const hasAlg = require('./hasAlg')
const isFunctor = require('./isFunctor')

// isApply : a -> Boolean
function isApply(m) {
  return isFunctor(m)
    && hasAlg('ap', m)
}

module.exports = isApply
