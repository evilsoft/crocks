/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const composeB = require('../combinators/composeB')
const curry = require('../helpers/curry')

const array = require('../internal/array')
const object = require('../internal/object')

const isArray = require('../predicates/isArray')
const isObject = require('../predicates/isObject')
const isFunction = require('../predicates/isFunction')

// map :: Functor f => (a -> b) -> f a -> f b
function map(fn, m) {
  if(!isFunction(fn)) {
    throw new TypeError('map: Function required for first argument')
  }
  else if(isFunction(m)) {
    return composeB(fn, m)
  }
  else if(isArray(m)) {
    return array.map(fn, m)
  }
  else if(m && isFunction(m.map)) {
    return m.map(fn)
  }
  else if(isObject(m)) {
    return object.map(fn, m)
  }
  else {
    throw new TypeError('map: Object, Function or Functor of the same type required for second argument')
  }
}

module.exports = curry(map)
