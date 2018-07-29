/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const VERSION = 2

import _implements from '../core/implements'
import _inspect from '../core/inspect'

import curry from '../core/curry'
import isFunction from '../core/isFunction'
import isSameType from '../core/isSameType'

import fl from '../core/flNames'

import { typeFn, type as getType } from '../core/types'

export const type = getType('Equiv')

const _type = typeFn(type(), VERSION)

const empty =
  () => Equiv(() => true)

export default function Equiv(compare) {
  if(!isFunction(compare)) {
    throw new TypeError('Equiv: Comparison function required')
  }

  const compareWith = curry(
    (x, y) => !!compare(x, y)
  )

  const inspect =
    () => `Equiv${_inspect(compare)}`

  const valueOf =
    () => compareWith

  function contramap(method) {
    return function(fn) {
      if(!isFunction(fn)) {
        throw new TypeError(`Equiv.${method}: Function required`)
      }

      return Equiv(
        (x, y) => compareWith(fn(x), fn(y))
      )
    }
  }

  function concat(method) {
    return function(m) {
      if(!isSameType(Equiv, m)) {
        throw new TypeError(`Equiv.${method}: Equiv required`)
      }

      return Equiv((x, y) =>
        compareWith(x, y) && m.compareWith(x, y)
      )
    }
  }

  return {
    inspect, toString: inspect, type,
    compareWith, valueOf, empty,
    concat: concat('concat'),
    contramap: contramap('contramap'),
    [fl.empty]: empty,
    [fl.concat]: concat(fl.concat),
    [fl.contramap]: contramap(fl.contramap),
    ['@@type']: _type,
    constructor: Equiv
  }
}

Equiv.empty = empty
Equiv.type = type

Equiv[fl.empty] = empty
Equiv['@@type'] = _type

Equiv['@@implements'] = _implements(
  [ 'concat', 'contramap', 'empty' ]
)
