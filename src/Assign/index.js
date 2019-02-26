/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const VERSION = 2

import _implements from '../core/implements'
import _inspect from '../core/inspect'
import { assign } from '../core/object'
import _equals from '../core/equals'

import fl from '../core/flNames'

import isNil from '../core/isNil'
import isObject from '../core/isObject'
import isSameType from '../core/isSameType'

import { typeFn, type as getType } from '../core/types'

export const type = getType('Assign')

const _type = typeFn(type(), VERSION)

const empty =
  () => Assign({})

function Assign(o) {
  const x = isNil(o) ? empty().valueOf() : o

  if(!arguments.length || !isObject(x)) {
    throw new TypeError('Assign: Object required')
  }

  const valueOf =
    () => x

  const inspect =
    () => `Assign${_inspect(valueOf())}`

  const equals =
    m => isSameType(Assign, m)
      && _equals(x, m.valueOf())

  function concat(method) {
    return function(m) {
      if(!isSameType(Assign, m)) {
        throw new TypeError(`Assign.${method}: Assign required`)
      }

      return Assign(assign(m.valueOf(), x))
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
    constructor: Assign
  }
}

Assign['@@implements'] = _implements(
  [ 'equals', 'concat', 'empty' ]
)

Assign.empty = empty
Assign.type = type

Assign[fl.empty] = empty
Assign['@@type'] = _type

export default Assign
