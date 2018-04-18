/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const VERSION = 2

import _equals from '../core/equals.js'
import _implements from '../core/implements.js'
import _inspect from '../core/inspect.js'
import types from '../core/types.js'
const type = types.type('Const')
const _type = types.typeFn(type(), VERSION)
import fl from '../core/flNames.js'

import isFunction from '../core/isFunction.js'
import isSameType from '../core/isSameType.js'

function Const(x) {
  if(!arguments.length) {
    throw new TypeError('Const: Must wrap something')
  }

  const equals =
    m => isSameType(Const, m)
      && _equals(x, m.valueOf())

  const inspect =
    () => `Const${_inspect(x)}`

  const valueOf =
    () => x

  function concat(method) {
    return function(m) {
      if(!isSameType(Const, m)) {
        throw new TypeError(`Const.${method}: Const required`)
      }

      return Const(x)
    }
  }

  function map(method) {
    return function(fn) {
      if(!isFunction(fn)) {
        throw new TypeError(`Const.${method}: Function required`)
      }

      return Const(x)
    }
  }

  function ap(m) {
    if(!isSameType(Const, m)) {
      throw new TypeError('Const.ap: Const required')
    }

    return Const(x)
  }

  function chain(method) {
    return function(fn) {
      if(!isFunction(fn)) {
        throw new TypeError(`Const.${method}: Function required`)
      }

      return Const(x)
    }
  }

  return {
    inspect, toString: inspect, valueOf,
    type, equals, ap,
    concat: concat('concat'),
    map: map('map'),
    chain: chain('chain'),
    [fl.equals]: equals,
    [fl.concat]: concat(fl.concat),
    [fl.map]: map(fl.map),
    [fl.chain]: chain(fl.chain),
    ['@@type']: _type,
    constructor: Const
  }
}

Const.type = type
Const['@@type'] = _type

Const['@@implements'] = _implements(
  [ 'ap', 'chain', 'concat', 'equals', 'map' ]
)

export default Const
