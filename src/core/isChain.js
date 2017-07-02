/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const hasAlg = require('./hasAlg')
const isApply = require('./isApply')

// isChain : a -> Boolean
function isChain(m) {
  return isApply(m)
    && hasAlg('chain', m)
}

module.exports = isChain
