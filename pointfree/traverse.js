/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('../funcs/curry')
const isFunction = require('../internal/isFunction')

function traverse(fn, af, m) {
  if(!isFunction(fn)) {
    throw new TypeError('traverse: Applicative returning function required for first argument')
  }
  else if(!isFunction(af)) {
    throw new TypeError('traverse: Applicative function required for second argument')
  }
  else if(!(m && isFunction(m.traverse))) {
    throw new TypeError('traverse: Traverable required for third argument')
  }

  return m.traverse(fn, af)
}

module.exports = curry(traverse)
