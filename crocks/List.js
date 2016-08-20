/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isFunction  = require('../internal/isFunction')
const isArray     = require('../internal/isArray')
const isType      = require('../internal/isType')

const constant  = require('../combinators/constant')

const _inspect    = require('../funcs/inspect')

const _type     = constant('List')
const _of       = x => List([ x ])
const _empty    = () => List([])

function List(xs) {
  if(!arguments.length || !isArray(xs)) {
    throw new TypeError('List: Must wrap an array')
  }

  function flatMap(fn) {
    return function(y, x) {
      const m = fn(x)

      if(!(m && isType(type(), m))) {
        throw new TypeError('List.chain: Function must return a List')
      }

      return y.concat(m.value())
    }
  }

  const type  = _type
  const of    = _of
  const value = constant(xs.slice())
  const empty = _empty

  const inspect = () => `List${_inspect(xs)}`

  function equals(m) {
    if(m && isType(type(), m)) {
      const mxs = m.value()

      return xs.length === mxs.length
        && xs.reduce((res, x, i) => res && x === mxs[i], true)
    }

    return false
  }

  function concat(m) {
    if(!(m && isType(type(), m))) {
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

  function filter(fn) {
    if(!isFunction(fn)) {
      throw new TypeError('List.filter: Function required')
    }

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
    else if(!(m && isType(type(), m))) {
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

  return {
    inspect, value, type, equals,
    empty, concat, reduce, filter,
    map, of, ap, chain
  }
}

List.type   = _type
List.of     = _of
List.empty  = _empty

module.exports = List
