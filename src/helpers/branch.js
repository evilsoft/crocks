/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const Pair = require('../core/Pair')

// branch : a -> Pair a a
function branch(x) {
  return Pair(x, x)
}

module.exports = branch
