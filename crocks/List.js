/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isApplicative = require('../predicates/isApplicative')
const isArray = require('../predicates/isArray')
const isFunction = require('../predicates/isFunction')
const isSameType = require('../predicates/isSameType')

const _inspect = require('../internal/inspect')

const constant = require('../combinators/constant')

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
  if(!arguments.length || !isArray(xs)) {
    throw new TypeError('List.fromArray: Must wrap an array')
  }
  return List(xs)
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

function List(xs) {
  if(!arguments.length || !isArray(xs)) {
    throw new TypeError('List: Must wrap an array')
  }

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
    () => xs.length && xs.reduce((res, x)  => res.concat(x), [])

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

  function filter(pred) {
    if(!(isFunction(pred) || isSameType(Pred, pred))) {
      throw new TypeError('List.filter: Pred or predicate function required')
    }

    const fn = isFunction(pred)
      ? pred
      : pred.runWith

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
    const allFuncs = xs.reduce((b, i) => b && isFunction(i), true)

    if(!allFuncs) {
      throw new TypeError('List.ap: Wrapped values must be all be functions')
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
    type, equals, concat, empty, reduce,
    filter, map, ap, of, chain, sequence,
    traverse
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
