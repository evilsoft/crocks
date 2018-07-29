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

export const type = getType('Min')

const _type = typeFn(type(), VERSION)

export const empty =
  () => Min(Infinity)

function Min(n) {
  const x = isNil(n) ? empty().valueOf() : n

  if(!arguments.length || !isNumber(x)) {
    throw new TypeError('Min: Numeric value required')
  }

  const valueOf =
    () => x

  const inspect =
    () => `Min${_inspect(valueOf())}`

  const equals =
    m => isSameType(Min, m)
      && _equals(x, m.valueOf())

  function concat(method) {
    return function(m) {
      if(!isSameType(Min, m)) {
        throw new TypeError(`Min.${method}: Min required`)
      }

      return Min(Math.min(x, m.valueOf()))
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
    constructor: Min
  }
}

Min['@@implements'] = _implements(
  [ 'equals', 'concat', 'empty' ]
)

Min.empty = empty
Min.type = type

Min[fl.empty] = empty
Min['@@type'] = _type

export default Min
