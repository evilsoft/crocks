/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isApply = require('./isApply')
const isArray = require('./isArray')
const isEmpty = require('./isEmpty')
const isFunction = require('./isFunction')
const isSameType = require('./isSameType')
const isSemigroup = require('./isSemigroup')
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

function fold(m) {
  if(isEmpty(m)) {
    throw new TypeError(
      'Array.fold: Non-empty Array of Semigroups required'
    )
  }

  const head =
    m[0]

  if(!isSemigroup(head)) {
    throw new TypeError('Array.fold: Must contain Semigroups of the same type')
  }

  return  m.reduce(function(x, y) {
    if(!isSameType(x, y)) {
      throw new TypeError('Array.fold: Must contain Semigroups of the same type')
    }
    return x.concat(y)
  })
}

function foldMap(fn, m) {
  if(isEmpty(m)) {
    throw new TypeError(
      'Array.foldMap: Non-empty Array required'
    )
  }

  const head =
    fn(m[0])

  if(!isSemigroup(head)) {
    throw new TypeError(
      'Array.foldMap: Provided function must return Semigroups of the same type'
    )
  }

  return m.length === 1
    ? head
    : m.slice(1).reduce(function(semi, x) {
      const val = fn(x)

      if(!(isSameType(semi, val) && isSemigroup(val))) {
        throw new TypeError(
          'Array.foldMap: Provided function must return Semigroups of the same type'
        )
      }

      return semi.concat(val)
    }, head)
}

function set(indx, val, m) {
  const arr = m.slice()

  arr[indx] = val

  return arr
}

module.exports = {
  ap, chain, fold, foldMap, map, sequence, set, traverse
}
