/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('../helpers/curry')

const composeB = require('../combinators/composeB')

const isFunction = require('../predicates/isFunction')

// map :: Functor f => (a -> b) -> f a -> f b
function map(fn, m) {
  if(!isFunction(fn)) {
    throw new TypeError('map: Function required for first argument')
  }
  else if(isFunction(m)) {
    return composeB(fn, m)
  }
  else if(m && isFunction(m.map)) {
    return m.map(fn)
  }
  else {
    throw new TypeError('map: Function or Functor of the same type required for second requirement')
  }
}

module.exports = curry(map)
