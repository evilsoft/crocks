/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const VERSION = 3

import _equals from '../core/equals'
import _implements from '../core/implements'
import _inspect from '../core/inspect'
import { empty as _empty, concat as _concat, equals as __equals, map as _map, of as _of } from '../core/flNames'

import isFunction from '../core/isFunction'
import isMonoid from '../core/isMonoid'
import isSameType from '../core/isSameType'
import isSemigroup from '../core/isSemigroup'

import { typeFn, type as getType } from '../core/types'
const _type = getType('Const')

const typeOrName =
  m => isFunction(m.type) ? m.type() : m.name

const constant = x => () => x

const empties = {
  Array: () => [],
  String: () => ''
}

const getEmpty = T =>
  T[_empty] || T.empty || empties[T.name]

const validMonoid = T =>
  isMonoid(T) || T.name === 'String' || T.name === 'Array'

function _Const(T) {
  if(!isFunction(T)) {
    throw new TypeError('Const: TypeRep required for construction')
  }

  const type =
    constant(_type(typeOrName(T)))

  const typeString =
    typeFn('Const', VERSION, typeOrName(T))

  function empty(method) {
    return function() {
      if(!validMonoid(T)) {
        throw new TypeError(`${type()}.${method}: Must be fixed to a Monoid`)
      }

      return Const(getEmpty(T)())
    }
  }

  function of(method) {
    return function() {
      if(!validMonoid(T)) {
        throw new TypeError(`${type()}.${method}: Must be fixed to a Monoid`)
      }

      return Const(getEmpty(T)())
    }
  }

  function Const(value) {
    if(!isSameType(T, value)) {
      throw new TypeError(`${type()}: ${typeOrName(T)} required`)
    }

    const inspect =
      constant(`${type()}${_inspect(value)}`)

    const valueOf =
      constant(value)

    const equals =
      m => isSameType(Const, m)
        && _equals(value, m.valueOf())

    function concat(method) {
      return function(m) {
        if(!isSemigroup(value)) {
          throw new TypeError(`${type()}.${method}: Must be fixed to a Semigroup`)
        }

        if(!isSameType(Const, m)) {
          throw new TypeError(`${type()}.${method}: ${type()} required`)
        }

        return Const(value.concat(m.valueOf()))
      }
    }

    function map(method) {
      return function(fn) {
        if(!isFunction(fn)) {
          throw new TypeError(`${type()}.${method}: Function required`)
        }

        return Const(value)
      }
    }

    function ap(m) {
      if(!isSemigroup(value)) {
        throw new TypeError(`${type()}.ap: Must be fixed to a Semigroup`)
      }

      if(!isSameType(Const, m)) {
        throw new TypeError(`${type()}.ap: ${type()} required`)
      }

      return Const(value.concat(m.valueOf()))
    }

    return {
      inspect, toString: inspect,
      valueOf, type, ap, equals,
      concat: concat('concat'),
      empty: empty('empty'),
      map: map('map'),
      of: of('of'),
      [_concat]: concat(_concat),
      [_empty]: empty(_empty),
      [__equals]: equals,
      [_map]: map(_map),
      [_of]: of(_of),
      ['@@type']: typeString,
      constructor: Const
    }
  }

  Const.empty = empty('empty')
  Const.of = of('of')
  Const.type = type

  Const[_empty] = empty(_empty)
  Const[_of] = of(_of)
  Const['@@type'] = typeString

  Const['@@implements'] = _implements(
    [ 'ap', 'concat', 'empty', 'equals', 'map', 'of' ]
  )

  return Const
}

export default _Const
