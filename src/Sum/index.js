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

export const type = getType('Sum')

const _type = typeFn(type(), VERSION)

const empty =
  () => Sum(0)

function Sum(n) {
  const x = isNil(n) ? empty().valueOf() : n

  if(!arguments.length || !isNumber(x)) {
    throw new TypeError('Sum: Numeric value required')
  }

  const valueOf =
    () => x

  const inspect =
    () => `Sum${_inspect(valueOf())}`

  const equals =
    m => isSameType(Sum, m)
      && _equals(x, m.valueOf())

  function concat(method) {
    return function(m) {
      if(!isSameType(Sum, m)) {
        throw new TypeError(`Sum.${method}: Sum required`)
      }

      return Sum(x + m.valueOf())
    }
  }

  return {
    inspect, toString: inspect, valueOf,
    equals, type, empty,
    concat: concat('concat'),
    [fl.equals]: equals,
    [fl.empty]: empty,
    [fl.concat]: concat(fl.concat),
    ['@@type']: _type,
    constructor: Sum
  }
}

Sum['@@implements'] = _implements(
  [ 'equals', 'concat', 'empty' ]
)

Sum.empty = empty
Sum.type = type

Sum[fl.empty] = empty
Sum['@@type'] = _type

export default Sum
