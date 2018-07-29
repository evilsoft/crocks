/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const VERSION = 2

import _implements from '../core/implements'
import _inspect from '../core/inspect'
import _equals from '../core/equals'
import fl from '../core/flNames'

import isSameType from '../core/isSameType'

import Maybe from '../core/Maybe'

import { typeFn, type as getType } from '../core/types'

export const type = getType('First')

const _type = typeFn(type(), VERSION)

const empty =
  () => First(Maybe.Nothing())

export default function First(x) {
  if(!arguments.length) {
    throw new TypeError('First: Requires one argument')
  }

  const maybe =
    !isSameType(Maybe, x) ? Maybe.of(x) : x.map(x => x)

  const inspect =
    () => `First(${_inspect(maybe)} )`

  const equals =
  m => isSameType(First, m)
    && _equals(maybe, m.valueOf())

  const valueOf =
    () => maybe

  const option =
    maybe.option

  function concat(method) {
    return function(m) {
      if(!isSameType(First, m)) {
        throw new TypeError(`First.${method}: First required`)
      }

      const n =
        m.valueOf().map(x => x)

      return First(
        maybe.either(() => n, Maybe.Just)
      )
    }
  }

  return {
    inspect, toString: inspect,
    equals, empty, option, type, valueOf,
    concat: concat('concat'),
    [fl.equals]: equals,
    [fl.empty]: empty,
    [fl.concat]: concat(fl.concat),
    ['@@type']: _type,
    constructor: First
  }
}

First['@@implements'] = _implements(
  [ 'equals', 'concat', 'empty' ]
)

First.empty = empty
First.type = type

First[fl.empty] = empty
First['@@type'] = _type
