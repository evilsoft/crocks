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
        ...[ ...parts.slice(0, parts.length - 1), fn(parts[parts.length - 1]) ]
      )
    }
  }

  function mapAll(method) {
    return function(...args) {
      if (args.length !== parts.length) {
        throw new TypeError(
          `${n}-Tuple.${method}: Requires ${parts.length} functions`
        )
      }
      return _Tuple(
        n,
        parts.map((v, i) => {
          if (!isFunction(args[i])) {
            throw new TypeError(
              `${n}-Tuple.${method}: Functions required for all arguments`
            )
          }
          return args[i](v)
        })
      )
    }
  }

  function project(method) {
    return function(index) {
      if (!isInteger(index) || index < 1 || index > n) {
        throw new TypeError(
          `${n}-Tuple.${method}: Index should be an integer between 2 and ${n}`
        )
      }
      return parts[index - 1]
    }
  }

  return {
    constructor: _Tuple,
    inspect,
    project: project('project'),
    map: map('map'),
    mapAll: mapAll('mapAll'),
    type,
    [fl.map]: map(fl.map),
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

Tuple['@@implements'] = _implements([])

module.exports = Tuple
