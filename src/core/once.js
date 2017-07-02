/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

// once : ((*) -> b) -> ((*) -> b)
function once(fn) {
  var called, result

  return function() {
    if(!called) {
      called = true
      result = fn.apply(null, arguments)
    }

    return result
  }
}

module.exports = once
