/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const _hasAlg = require('../internal/hasAlg')
const isApply = require('./isApply')

// isApplicative : a -> Boolean
function isApplicative(m) {
  return isApply(m)
    && _hasAlg('of', m)
}

module.exports = isApplicative
