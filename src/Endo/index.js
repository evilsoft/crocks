/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const VERSION = 2

import _implements from '../core/implements'
import _inspect from '../core/inspect'
import fl from '../core/flNames'

import compose from '../core/compose'
import isFunction from '../core/isFunction'
import isSameType from '../core/isSameType'

import { typeFn, type as getType } from '../core/types'

export const type = getType('Endo')

const _type = typeFn(type(), VERSION)

export const empty =
  () => Endo(x => x)

export default function Endo(runWith) {
  if(!isFunction(runWith)) {
    throw new TypeError('Endo: Function value required')
  }

  const valueOf =
    () => runWith

  const inspect =
    () => `Endo${_inspect(valueOf())}`

  function concat(method) {
    return function(m) {
      if(!isSameType(Endo, m)) {
        throw new TypeError(`Endo.${method}: Endo required`)
      }

      return Endo(compose(m.valueOf(), valueOf()))
    }
  }

  return {
    inspect, toString: inspect,
    valueOf, type, empty, runWith,
    concat: concat('concat'),
    [fl.empty]: empty,
    [fl.concat]: concat(fl.concat),
    ['@@type']: _type,
    constructor: Endo
  }
}

Endo['@@implements'] = _implements(
  [ 'concat', 'empty' ]
)

Endo.empty = empty
Endo.type = type

Endo[fl.empty] = empty
Endo['@@type'] = _type
