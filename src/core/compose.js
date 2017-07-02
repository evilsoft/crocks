/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

// Composition (Bluebird)
// compose : (b -> c) -> (a -> b) -> a -> c
function compose(f, g) {
  return function(x) {
    return f(g(x))
  }
}

module.exports = compose
