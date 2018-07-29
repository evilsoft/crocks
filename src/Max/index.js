/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const VERSION = 2

import _implements from '../core/implements'
import _inspect from '../core/inspect'
import _equals from '../core/equals'
import fl from '../core/flNames'

import isNil from '../core/isNil'
import isNumber from '../core/isNumber'
import isSameType from '../core/isSameType'

import { typeFn, type as getType } from '../core/types'

export const type = getType('Max')

const _type = typeFn(type(), VERSION)

export const empty =
  () => Max(-Infinity)

function Max(n) {
  const x = isNil(n) ? empty().valueOf() : n

  if(!arguments.length || !isNumber(x)) {
    throw new TypeError('Max: Numeric value required')
  }

  const valueOf =
    () => x

  const inspect =
    () => `Max${_inspect(valueOf())}`

  const equals =
    m => isSameType(Max, m)
      && _equals(x, m.valueOf())

  function concat(method) {
    return function(m) {
      if(!isSameType(Max, m)) {
        throw new TypeError(`Max.${method}: Max requried`)
      }

      return Max(Math.max(x, m.valueOf()))
    }
  }

  return {
    inspect, toString: inspect,
    equals, valueOf, type, empty,
    concat: concat('concat'),
    [fl.equals]: equals,
    [fl.empty]: empty,
    [fl.concat]: concat(fl.concat),
    ['@@type']: _type,
    constructor: Max
  }
}

Max['@@implements'] = _implements(
  [ 'equals', 'concat', 'empty' ]
)

Max.empty = empty
Max.type = type

Max[fl.empty] = empty
Max['@@type'] = _type

export default Max
