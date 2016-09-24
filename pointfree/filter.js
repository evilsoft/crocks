/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('../funcs/curry')
const isFunction = require('../internal/isFunction')

// filter :: Foldable f => (a -> Boolean) -> f a -> f a
function filter(fn, m) {
  if(!isFunction(fn)) {
    throw new TypeError('filter: Function required for first argument')
  }
  else if(m && isFunction(m.filter)) {
    return m.filter(fn)
  }
  else {
    throw new TypeError('filter: Foldable of the same type required for second argument')
  }
}

module.exports = curry(filter)
