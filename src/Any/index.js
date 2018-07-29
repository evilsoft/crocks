/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const VERSION = 2

import _implements from '../core/implements'
import _inspect from '../core/inspect'
import _equals from '../core/equals'
import fl from '../core/flNames'

import isFunction from '../core/isFunction'
import isNil from '../core/isNil'
import isSameType from '../core/isSameType'

import { typeFn, type as getType } from '../core/types'

export const type = getType('Any')

const _type = typeFn(type(), VERSION)

export const empty =
  () => Any(false)

function Any(b) {
  const x = isNil(b) ? empty().valueOf() : b

  if(!arguments.length || isFunction(x)) {
    throw new TypeError('Any: Non-function value required')
  }

  const valueOf =
    () => !!x

  const inspect =
    () => `Any${_inspect(valueOf())}`

  const equals =
    m => isSameType(Any, m)
      && _equals(x, m.valueOf())

  function concat(method) {
    return function(m) {
      if(!isSameType(Any, m)) {
        throw new TypeError(`Any.${method}: Any required`)
      }

      return Any(m.valueOf() || valueOf())
    }
  }

  return {
    inspect, toString: inspect,
    equals, valueOf, type, empty,
    ['@@type']: _type,
    concat: concat('concat'),
    [fl.equals]: equals,
    [fl.concat]: concat(fl.concat),
    [fl.empty]: empty,
    constructor: Any
  }
}

Any['@@implements'] = _implements(
  [ 'equals', 'concat', 'empty' ]
)

Any.empty = empty
Any.type  = type

Any[fl.empty] = empty
Any['@@type'] = _type

export default Any
