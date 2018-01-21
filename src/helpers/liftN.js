/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const array = require('../core/array')
const curry = require('../core/curry')
const curryN = require('../core/curryN')

const isApply = require('../core/isApply')
const isArray = require('../core/isArray')
const isFunction = require('../core/isFunction')
const isFunctor = require('../core/isFunctor')
const isInteger = require('../core/isInteger')
const isSameType = require('../core/isSameType')

const ap = array.ap

const applyAp = (x, y) => {
  if(!(isSameType(x, y) && (isArray(y) || isApply(y)))) {
    throw new TypeError('liftN: Applys of same type are required')
  }

  if(isArray(x)) {
    return ap(y, x)
  }

  return x.ap(y)
}

function liftN(n, fn) {
  if(!isInteger(n)) {
    throw new TypeError('liftN: Integer required for first argument')
  }

  if(!isFunction(fn)) {
    throw new TypeError('liftN: Function required for second argument')
  }

  return curryN(n, function(...args) {
    if(!isFunctor(args[0])) {
      throw new TypeError('liftN: Applys of same type are required')
    }

    return args.slice(1, n).reduce(
      applyAp,
      args[0].map(x => curryN(n, fn)(x))
    )
  })
}

module.exports = curry(liftN)
