/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const array = require('../core/array')
const curry = require('../core/curry')
const isArray = require('../core/isArray')
const isFunction = require('../core/isFunction')

function traverse(af, fn, m) {
  if(!isFunction(af)) {
    throw new TypeError('traverse: Apply function required for first argument')
  }

  if(!isFunction(fn)) {
    throw new TypeError('traverse: Apply returning function required for second argument')
  }

  if(m && isFunction(m.traverse)) {
    return m.traverse(af, fn)
  }

  if(isArray(m)) {
    return array.traverse(af, fn, m)
  }

  throw new TypeError('traverse: Traversable or Array required for third argument')
}

module.exports = curry(traverse)
