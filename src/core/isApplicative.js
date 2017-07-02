/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const hasAlg = require('./hasAlg')
const isApply = require('./isApply')

// isApplicative : a -> Boolean
function isApplicative(m) {
  return isApply(m)
    && hasAlg('of', m)
}

module.exports = isApplicative
