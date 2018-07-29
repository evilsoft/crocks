/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const VERSION = 2

import _implements from '../core/implements'
import _inspect from '../core/inspect'
import fl from '../core/flNames'

import compose from '../core/compose'
import isFunction from '../core/isFunction'
import isSameType from '../core/isSameType'

import { typeFn, type as getType } from '../core/types'

export const type = getType('Pred')

const _type = typeFn(type(), VERSION)

export const empty =
  () => Pred(() => true)

export default function Pred(pred) {
  if(!isFunction(pred)) {
    throw new TypeError('Pred: Predicate function required')
  }

  const runWith =
    x => !!pred(x)

  const inspect =
    () => `Pred${_inspect(runWith)}`

  const valueOf =
    () => runWith

  function concat(method) {
    return function(m) {
      if(!isSameType(Pred, m)) {
        throw new TypeError(`Pred.${method}: Pred required`)
      }

      return Pred(x => !!runWith(x) && !!m.runWith(x))
    }
  }

  function contramap(method) {
    return function(fn) {
      if(!isFunction(fn)) {
        throw new TypeError(`Pred.${method}: Function required`)
      }

      return Pred(compose(runWith, fn))
    }
  }

  return {
    inspect, toString: inspect,
    runWith, type, valueOf, empty,
    concat: concat('concat'),
    contramap: contramap('contramap'),
    [fl.empty]: empty,
    [fl.concat]: concat(fl.concat),
    [fl.contramap]: contramap(fl.contramap),
    ['@@type']: _type,
    constructor: Pred
  }
}

Pred.empty = empty
Pred.type = type

Pred[fl.empty] = empty
Pred['@@type'] = _type

Pred['@@implements'] = _implements(
  [ 'concat', 'contramap', 'empty' ]
)
