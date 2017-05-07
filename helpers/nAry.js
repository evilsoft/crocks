/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('../helpers/curry')
const curryN = require('../internal/curryN')
const isFunction = require('../predicates/isFunction')
const isNumber = require('../predicates/isNumber')

// nAry : Number -> (* -> a) -> * -> * -> a
function nAry(num, fn) {
  if(!isNumber(num)) {
    throw new TypeError('nAry: Number required for first argument')
  }

  if(!isFunction(fn)) {
    throw new TypeError('nAry: Function required for second argument')
  }

  return curryN(num, fn)
}

module.exports = curry(nAry)
