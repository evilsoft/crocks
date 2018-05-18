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

function _Tuple(n, values) {
  if (n !== values.length) {
    throw new TypeError(
      `${n}-Tuple: Expected ${n} values, but got ${values.length}`
    )
  }

  const inspect = () => `Tuple(${values.map(_inspect).join(',')} )`

  function map(method) {
    return function(fn) {
      if (!isFunction(fn)) {
        throw new TypeError(`Tuple.${method}: Function required`)
      }
      return Tuple(n)(
        ...[
          ...values.slice(0, values.length - 1),
          fn(values[values.length - 1])
        ]
      )
    }
  }

  return {
    constructor: _Tuple,
    inspect,
    map: map('map'),
    type,
    [fl.map]: map(fl.map),
    ['@@type']: _type,
    toString: inspect
  }
}

function Tuple(n) {
  if (!isInteger(n) || n < 1) {
    throw new TypeError('Tuple: Tuple size should be a number greater than 1')
  }

  const fn = (...args) => _Tuple(n, args)
  Object.defineProperty(fn, 'length', { value: n })
  return fn
}

Tuple.type = type
Tuple['@@type'] = _type

Tuple['@@implements'] = _implements([])

module.exports = Tuple
