/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const _hasAlg = require('../internal/hasAlg')
const isApply = require('./isApply')

// isChain : a -> Boolean
function isChain(m) {
  return isApply(m)
    && _hasAlg('chain', m)
}

module.exports = isChain
