/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('../helpers/curry')
const isFunction = require('../internal/isFunction')

function second(fn, m) {
  if(!isFunction(fn)) {
    throw new TypeError('second: Function required for first argument')
  }

  if(!(m && isFunction(m.second))) {
    throw new TypeError('second: Arrow of the same type required for second argument')
  }

  return m.second(fn)
}

module.exports = curry(second)
