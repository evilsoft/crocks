/** @license ISC License (c) copyright 2018 original and current authors */
/** @author Karthik Iyengar (karthikiyengar) */

const VERSION = 1

const _implements = require('../core/implements')
const _equals = require('../core/equals')
const _inspect = require('../core/inspect')
const _type = require('../core/types').type('Tuple')
const typeFn = require('../core/types').typeFn
const fl = require('../core/flNames')

const isFunction = require('../core/isFunction')
const isInteger = require('../core/isInteger')
const isSameType = require('../core/isSameType')
const isSemigroup = require('../core/isSemigroup')

const constant = x => () => x

function _Tuple(n) {
  if (!(isInteger(n) && n >= 1)) {
    throw new TypeError('Tuple: First argument must be an integer')
  }

  const type =
    constant(_type(n))

  const typeString =
    typeFn('Tuple', VERSION, n)

  const withProps = fn => {
    fn.type = type
    fn['@@type'] = typeString
    fn['@@implements'] = _implements([ 'map', 'concat', 'equals' ])
    return fn
  }

  const withLength = (n, fn) => {
    return Object.defineProperty(fn, 'length', {
      value: n
    })
  }

  /* eslint-disable no-unused-vars */
  switch (n) {
  case 1: return withProps(function(a) { return Tuple(n, arguments) })
  case 2: return withProps(function(a, b) { return Tuple(n, arguments) })
  case 3: return withProps(function(a, b, c) { return Tuple(n, arguments) })
  case 4: return withProps(function(a, b, c, d) { return Tuple(n, arguments) })
  case 5: return withProps(function(a, b, c, d, e) { return Tuple(n, arguments) })
  case 6: return withProps(function(a, b, c, d, e, f) { return Tuple(n, arguments) })
  case 7: return withProps(function(a, b, c, d, e, f, g) { return Tuple(n, arguments) })
  case 8: return withProps(function(a, b, c, d, e, f, g, h) { return Tuple(n, arguments) })
  case 9: return withProps(function(a, b, c, d, e, f, g, h, i) { return Tuple(n, arguments) })
  case 10: return withProps(function(a, b, c, d, e, f, g, h, i, j) { return Tuple(n, arguments) })
  default: return withLength(n, withProps(function(...parts) { return Tuple(n, parts) }))
  }
  /* eslint-enable no-unused-vars */

  function Tuple(n, args) {
    const parts = [].slice.call(args)
    if (n !== parts.length) {
      throw new TypeError(
        `${n}-Tuple: Expected ${n} values, but got ${parts.length}`
      )
    }

    const inspect = () =>
      `${n}-Tuple(${parts.map(_inspect).join(',')} )`

    function map(method) {
      return function(fn) {
        if (!isFunction(fn)) {
          throw new TypeError(`${n}-Tuple.${method}: Function required`)
        }

        return Tuple(n, parts
          .slice(0, parts.length - 1)
          .concat(fn(parts[parts.length - 1]))
        )
      }
    }

    const equals = m =>
      isSameType({ type }, m)
        && _equals(parts, m.toArray())

    function concat(method) {
      return function(t) {
        if (!isSameType({ type }, t)) {
          throw new TypeError(`${n}-Tuple.${method}: Tuple of the same length required`)
        }

        const a = t.toArray()

        return Tuple(n, parts.map((v, i, o) => {
          if (!(isSemigroup(a[i]) && isSemigroup(o[i]))) {
            throw new TypeError(
              `${n}-Tuple.${method}: Both Tuples must contain Semigroups of the same type`
            )
          }

          if (!isSameType(a[i], o[i])) {
            throw new TypeError(
              `${n}-Tuple.${method}: Both Tuples must contain Semigroups of the same type`
            )
          }

          return o[i].concat(a[i])
        }))
      }
    }

    function merge(fn) {
      if (!isFunction(fn)) {
        throw new TypeError(`${n}-Tuple.merge: Function required`)
      }

      return fn(...parts)
    }

    function mapAll(...args) {
      if (args.length !== parts.length) {
        throw new TypeError(
          `${n}-Tuple.mapAll: Requires ${parts.length} functions`
        )
      }

      return Tuple(
        n,
        parts.map((v, i) => {
          if (!isFunction(args[i])) {
            throw new TypeError(
              `${n}-Tuple.mapAll: Functions required for all arguments`
            )
          }
          return args[i](v)
        })
      )
    }

    function project(index) {
      if (!isInteger(index) || index < 1 || index > n) {
        throw new TypeError(
          `${n}-Tuple.project: Index should be an integer between 1 and ${n}`
        )
      }

      return parts[index - 1]
    }

    function toArray() {
      return parts.slice()
    }

    return {
      inspect, toString: inspect, merge,
      project, mapAll, toArray,
      type, equals,
      map: map('map'),
      concat: concat('concat'),
      [fl.map]: map(fl.map),
      [fl.concat]: concat(fl.concat),
      [fl.equals]: equals,
      ['@@type']: typeString,
      constructor: Tuple
    }
  }
}

module.exports = _Tuple
