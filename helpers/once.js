/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isFunction = require('../predicates/isFunction')

// once : ((*) -> b) -> ((*) -> b)
function once(fn) {
  var called, result

  if(!isFunction(fn)) {
    throw new TypeError('once: Function required')
  }

  return function() {
    if(!called) {
      called = true
      result = fn.apply(null, arguments)
    }

    return result
  }
}

module.exports = once
