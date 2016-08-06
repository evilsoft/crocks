/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

// argsArray :: ArrayLike -> [ a ]
function argsArray(x) {
  return Array.prototype.slice.call(x)
}

module.exports = argsArray
