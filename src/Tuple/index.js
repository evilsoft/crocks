/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Karthik Iyengar (karthikiyengar) */

const VERSION = 1

const _implements = require('../core/implements')
const _inspect = require('../core/inspect')
const type = require('../core/types').type('Tuple')
const _type = require('../core/types').typeFn(type(), VERSION)
const fl = require('../core/flNames')

const isFunction = require('../core/isFunction')
const isInteger = require('../core/isInteger')
const isSameType = require('../core/isSameType')
const isSemigroup = require('../core/isSemigroup')

function _Tuple(n, args) {
  const parts = [].slice.call(args)
  if (n !== parts.length) {
    throw new TypeError(
      `${n}-Tuple: Expected ${n} values, but got ${parts.length}`
    )
  }

  const inspect = () => `Tuple(${parts.map(_inspect).join(',')} )`

  function map(method) {
    return function(fn) {
      if (!isFunction(fn)) {
        throw new TypeError(`${n}-Tuple.${method}: Function required`)
      }
      return Tuple(n)(
        ...parts.slice(0, parts.length - 1).concat(fn(parts[parts.length - 1]))
      )
    }
  }

  function concat(method) {
    return function(t) {
      if (!isSameType(Tuple, t)) {
        throw new TypeError(`${n}-Tuple.${method}: Tuple Required`)
      }
      const a = t.toArray()
      if (a.length !== n) {
        throw new TypeError(
          `${n}-Tuple.${method}: Tuples should be of the same size`
        )
      }

      return Tuple(n)(
        ...parts.map((v, i, o) => {
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
        })
      )
    }
  }

  function mapAll(...args) {
    if (args.length !== parts.length) {
      throw new TypeError(
        `${n}-Tuple.mapAll: Requires ${parts.length} functions`
      )
    }
    return _Tuple(
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
        `${n}-Tuple.project: Index should be an integer between 2 and ${n}`
      )
    }
    return parts[index - 1]
  }

  function toArray() {
    return parts.slice()
  }

  return {
    constructor: _Tuple,
    inspect,
    project: project,
    map: map('map'),
    concat: concat('concat'),
    mapAll: mapAll,
    toArray,
    type,
    [fl.map]: map(fl.map),
    [fl.concat]: concat(fl.concat),
    ['@@type']: _type,
    toString: inspect
  }
}

function Tuple(n) {
  if (!isInteger(n) || n < 1 || n > 10) {
    throw new TypeError(
      'Tuple: Tuple size should be a number greater than 1 and less than 10'
    )
  }

  /* eslint-disable */
  switch (n) {
    case 2:
      return function(a, b) {
        return _Tuple(n, arguments)
      }
    case 3:
      return function(a, b, c) {
        return _Tuple(n, arguments)
      }
    case 4:
      return function(a, b, c, d) {
        return _Tuple(n, arguments)
      }
    case 5:
      return function(a, b, c, d, e) {
        return _Tuple(n, arguments)
      }
    case 6:
      return function(a, b, c, d, e, f) {
        return _Tuple(n, arguments)
      }
    case 7:
      return function(a, b, c, d, e, f, g) {
        return _Tuple(n, arguments)
      }
    case 8:
      return function(a, b, c, d, e, f, g, h) {
        return _Tuple(n, arguments)
      }
    case 9:
      return function(a, b, c, d, e, f, g, h, i) {
        return _Tuple(n, arguments)
      }
    case 10:
      return function(a, b, c, d, e, f, g, h, i, j) {
        return _Tuple(n, arguments)
      }
  }
  /* eslint-enable */
}

Tuple.type = type
Tuple['@@type'] = _type

Tuple['@@implements'] = _implements([ 'map', 'concat' ])

module.exports = Tuple
