/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isApplicative = require('../predicates/isApplicative')
const isArray = require('../predicates/isArray')
const isEmpty = require('../predicates/isEmpty')
const isFunction = require('../predicates/isFunction')
const isSameType = require('../predicates/isSameType')
const isSemigroup = require('../predicates/isSemigroup')

const _inspect = require('../internal/inspect')
const predOrFunc = require('../internal/predOrFunc')

const constant = require('../combinators/constant')
const not = require('../logic/not')

const _concat = require('../pointfree/concat')

const Maybe = require('./Maybe')
const Pred = require('./Pred')

const Nothing = Maybe.Nothing
const Just = Maybe.Just

const _type =
  constant('List')

const _of =
  x => List([ x ])

const _empty =
  () => List([])

function fromArray(xs) {
  if(!isArray(xs)) {
    throw new TypeError('List.fromArray: Array required')
  }
  return xs.reduce((res, x) => res.concat(List.of(x)), List.empty())
}

function runSequence(acc, x) {
  if(!isApplicative(x)) {
    throw new TypeError('List.sequence: Must wrap Applicatives')
  }

  return x
    .map(v => _concat(List.of(v)))
    .ap(acc)
}

function runTraverse(f) {
  return function(acc, x) {
    const m = f(x)

    if(!isApplicative(acc) || !isApplicative(m)) {
      throw new TypeError('List.traverse: Both functions must return an Applicative')
    }

    return m
      .map(v => _concat(List.of(v)))
      .ap(acc)
  }
}

function List(x) {
  if(!arguments.length) {
    throw new TypeError('List: List must wrap something')
  }

  const xs = isArray(x) ? x.slice() : [ x ]

  function flatMap(fn) {
    return function(y, x) {
      const m = fn(x)

      if(!isSameType(List, m)) {
        throw new TypeError('List.chain: Function must return a List')
      }

      return y.concat(m.value())
    }
  }

  const type =
    _type

  const of =
    _of

  const value =
    () => xs.slice()

  const toArray =
    value

  const empty =
    _empty

  const inspect =
    () => `List${_inspect(xs)}`

  const head =
    () => xs.length
      ? Just(xs[0])
      : Nothing()

  const tail =
    () => xs.length && xs.length > 1
      ? Just(List(xs.slice(1)))
      : Nothing()

  const cons =
    x => List([x].concat(xs))

  function equals(m) {
    if(isSameType(List, m)) {
      const mxs = m.value()

      return xs.length === mxs.length
        && xs.reduce((res, x, i) => res && x === mxs[i], true)
    }

    return false
  }

  function concat(m) {
    if(!isSameType(List, m)) {
      throw new TypeError('List.concat: List required')
    }

    return List(xs.concat(m.value()))
  }

  function reduce(fn, i) {
    if(!isFunction(fn)) {
      throw new TypeError('List.reduce: Function required for first argument')
    }

    return xs.reduce(fn, i)
  }

  function fold() {
    if(isEmpty(xs)) {
      throw new TypeError('List.fold: List must contain at least one Semigroup')
    }
    if(xs.length === 1) {
      if(!isSemigroup(xs[0])) {
        throw new TypeError('List.fold: List must contain Semigroups of the same type')
      }
      return xs[0]
    }
    return xs.reduce(function(x, y) {
      if(!(isSemigroup(x) && isSameType(x, y))) {
        throw new TypeError('List.fold: List must contain Semigroups of the same type')
      }
      return x.concat(y)
    })
  }

  function filter(pred) {
    if(!(isFunction(pred) || isSameType(Pred, pred))) {
      throw new TypeError('List.filter: Pred or predicate function required')
    }

    const fn = predOrFunc(pred)

    return reduce(
      (x, y) => fn(y) ? x.concat(x.of(y)) : x,
      empty()
    )
  }

  function reject(pred) {
    if(!(isFunction(pred) || isSameType(Pred, pred))) {
      throw new TypeError('List.reject: Pred or predicate function required')
    }

    const fn = not(predOrFunc(pred))

    return reduce(
      (x, y) => fn(y) ? x.concat(x.of(y)) : x,
      empty()
    )
  }

  function map(fn) {
    if(!isFunction(fn)) {
      throw new TypeError('List.map: Function required')
    }

    return List(xs.map(x => fn(x)))
  }

  function ap(m) {
    const allFuncs =
      xs.reduce((b, i) => b && isFunction(i), true)

    if(!allFuncs) {
      throw new TypeError('List.ap: Wrapped values must all be functions')
    }
    else if(!isSameType(List, m)) {
      throw new TypeError('List.ap: List required')
    }

    return chain(fn => m.map(fn))
  }

  function chain(fn) {
    if(!isFunction(fn)) {
      throw new TypeError('List.chain: Function required')
    }

    return List(xs.reduce(flatMap(fn), []))
  }

  function sequence(af) {
    if(!isFunction(af)) {
      throw new TypeError('List.sequence: Applicative Function required')
    }

    return reduce(
      runSequence,
      af(List.empty())
    )
  }

  function traverse(af, f) {
    if(!isFunction(f) || !isFunction(af)) {
      throw new TypeError('List.traverse: Applicative returning functions required for both arguments')
    }

    return reduce(
      runTraverse(f),
      af(List.empty())
    )
  }

  return {
    inspect, value, toArray, head, tail, cons,
    type, equals, concat, empty, reduce, fold,
    filter, reject, map, ap, of, chain,
    sequence, traverse
  }
}

List.type =
  _type

List.of =
  _of

List.empty =
  _empty

List.fromArray =
  fromArray

module.exports = List
