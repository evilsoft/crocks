/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isApply = require('./isApply')
const isArray = require('./isArray')
const isFunction = require('./isFunction')
const isSameType = require('./isSameType')
const apOrFunc = require('./apOrFunc')

const identity =
  x => x

const concat =
  x => m => x.concat(m)

function runTraverse(name, fn) {
  return function(acc, x) {
    const m = fn(x)

    if(!((isApply(acc) || isArray(acc)) && isSameType(acc, m))) {
      throw new TypeError(`Array.${name}: Must wrap Applys of the same type`)
    }

    if(isArray(m)) {
      return ap(acc, map(v => concat([ v ]), m))
    }

    return m
      .map(v => concat([ v ]))
      .ap(acc)
  }
}

const allFuncs =
  xs => xs.reduce((b, i) => b && isFunction(i), true)

const map =
  (f, m) => m.map(x => f(x))

function ap(x, m) {
  if(!(m.length && allFuncs(m))) {
    throw new TypeError('Array.ap: Second Array must all be functions')
  }

  return m.reduce((acc, f) => acc.concat(map(f, x)), [])
}

function chain(f, m) {
  return m.reduce(function(y, x) {
    const n = f(x)

    if(!isArray(n)) {
      throw new TypeError('Array.chain: Function must return an Array')
    }

    return y.concat(n)
  }, [])
}

function sequence(f, m) {
  const fn = apOrFunc(f)
  return m.reduceRight(runTraverse('sequence', identity), fn([]))
}

function traverse(f, fn, m) {
  const af = apOrFunc(f)
  return m.reduceRight(runTraverse('traverse', fn), af([]))
}

module.exports = {
  ap, chain, map, sequence, traverse
}
