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

export const type = getType('All')

const _type = typeFn(type(), VERSION)

export const empty =
  () => All(true)

function All(b) {
  const x = isNil(b) ? empty().valueOf() : b

  if(!arguments.length || isFunction(x)) {
    throw new TypeError('All: Non-function value required')
  }

  const valueOf =
    () => !!x

  const equals =
    m => isSameType(All, m)
      && _equals(x, m.valueOf())

  const inspect =
    () => `All${_inspect(valueOf())}`

  function concat(method) {
    return function(m) {
      if(!isSameType(All, m)) {
        throw new TypeError(`All.${method}: All required`)
      }

      return All(m.valueOf() && valueOf())
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
    constructor: All
  }
}

All['@@implements'] = _implements(
  [ 'equals', 'concat', 'empty' ]
)

All.empty = empty
All.type = type

All[fl.empty] = empty
All['@@type'] = _type

export default All
