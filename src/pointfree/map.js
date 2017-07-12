/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const array = require('../core/array')
const compose = require('../core/compose')
const curry = require('../core/curry')
const isArray = require('../core/isArray')
const isObject = require('../core/isObject')
const isFunction = require('../core/isFunction')
const object = require('../core/object')

// map : Functor f => (a -> b) -> f a -> f b
function map(fn, m) {
  if(!isFunction(fn)) {
    throw new TypeError('map: Function required for first argument')
  }

  if(isFunction(m)) {
    return compose(fn, m)
  }

  if(isArray(m)) {
    return array.map(fn, m)
  }

  if(m && isFunction(m.map)) {
    return m.map(fn)
  }

  if(isObject(m)) {
    return object.map(fn, m)
  }

  throw new TypeError('map: Object, Function or Functor of the same type required for second argument')
}

module.exports = curry(map)
