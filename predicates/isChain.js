/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isFunction = require('./isFunction')
const isApply = require('./isApply')

// isChain : a -> Boolean
function isChain(m) {
  return isApply(m) && isFunction(m.chain)
}

module.exports = isChain
