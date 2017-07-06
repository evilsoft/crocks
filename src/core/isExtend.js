/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const hasAlg = require('./hasAlg')
const isFunctor = require('./isFunctor')

// isExtend : a -> Boolean
function isExtend(m) {
  return isFunctor(m)
    && hasAlg('extend', m)
}

module.exports = isExtend
