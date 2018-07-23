/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Robert Pearce (rpearce) */

// isSymbol : a -> Boolean
function isSymbol(x) {
  return typeof x === 'symbol'
}

module.exports = isSymbol
