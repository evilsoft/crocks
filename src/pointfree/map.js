/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const compose = require('../core/compose')
const curry = require('../core/curry')
const isArray = require('../core/isArray')
const isObject = require('../core/isObject')
const isFunction = require('../core/isFunction')
const isFunctor= require('../core/isFunctor')

const array = require('../core/array')
const object = require('../core/object')
const fl = require('../core/flNames')

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

  if(m && isFunctor(m)) {
    return (m[fl.map] || m.map).call(m, fn)
  }

  if(isObject(m)) {
    return object.map(fn, m)
  }

  throw new TypeError('map: Object, Function or Functor of the same type required for second argument')
}

module.exports = curry(map)
