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

const type = getType('Prod')

const _type = typeFn(type(), VERSION)

export const empty =
  () => Prod(1)

function Prod(n) {
  const x = isNil(n) ? empty().valueOf() : n

  if(!arguments.length || !isNumber(x)) {
    throw new TypeError('Prod: Numeric value required')
  }

  const valueOf =
    () => x

  const inspect =
    () => `Prod${_inspect(valueOf())}`

  const equals =
    m => isSameType(Prod, m)
      && _equals(x, m.valueOf())

  function concat(method) {
    return function(m) {
      if(!isSameType(Prod, m)) {
        throw new TypeError(`Prod.${method}: Prod required`)
      }

      return Prod(x * m.valueOf())
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
    constructor: Prod
  }
}

Prod['@@implements'] = _implements(
  [ 'equals', 'concat', 'empty' ]
)

Prod.empty = empty
Prod.type = type

Prod[fl.empty] = empty
Prod['@@type'] = _type

export default Prod
