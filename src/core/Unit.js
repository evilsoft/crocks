/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const VERSION = 2

import _implements from './implements'
import fl from './flNames'

import isFunction from './isFunction'
import isSameType from './isSameType'

import { typeFn, type as getType } from './types'

export const type = getType('Unit')

const _type = typeFn(type(), VERSION)

const of =
  Unit

const empty =
  Unit

export default function Unit() {
  const equals =
    m => isSameType(Unit, m)

  const inspect =
    () => '()'

  const valueOf =
    () => undefined

  function concat(method) {
    return function(m) {
      if(!isSameType(Unit, m)) {
        throw new TypeError(`Unit.${method}: Unit required`)
      }

      return Unit()
    }
  }

  function map(method) {
    return function(fn) {
      if(!isFunction(fn)) {
        throw new TypeError(`Unit.${method}: Function required`)
      }

      return Unit()
    }
  }

  function ap(m) {
    if(!isSameType(Unit, m)) {
      throw new TypeError('Unit.ap: Unit required')
    }

    return Unit()
  }

  function chain(method) {
    return function(fn) {
      if(!isFunction(fn)) {
        throw new TypeError(`Unit.${method}: Function required`)
      }

      return Unit()
    }
  }

  return {
    inspect, toString: inspect, valueOf,
    type, equals, empty, ap, of,
    concat: concat('concat'),
    map: map('map'),
    chain: chain('chain'),
    [fl.of]: of,
    [fl.empty]: empty,
    [fl.equals]: equals,
    [fl.concat]: concat(fl.concat),
    [fl.map]: map(fl.map),
    [fl.chain]: chain(fl.chain),
    ['@@type']: _type,
    constructor: Unit
  }
}

Unit.of = of
Unit.empty = empty
Unit.type = type

Unit[fl.of] = of
Unit[fl.empty] = empty
Unit['@@type'] = _type

Unit['@@implements'] = _implements(
  [ 'ap', 'chain', 'concat', 'empty', 'equals', 'map', 'of' ]
)
