/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const VERSION = 1

import _implements from '../core/implements.js'
import _inspect from '../core/inspect.js'
import types from '../core/types.js'
const type = types.type('Pred')
const _type = types.typeFn(type(), VERSION)
import fl from '../core/flNames.js'

import compose from '../core/compose.js'
import isFunction from '../core/isFunction.js'
import isSameType from '../core/isSameType.js'

const _empty =
  () => Pred(() => true)

function Pred(pred) {
  if(!isFunction(pred)) {
    throw new TypeError('Pred: Predicate function required')
  }

  const runWith =
    x => !!pred(x)

  const inspect =
    () => `Pred${_inspect(runWith)}`

  const empty =
    _empty

  const valueOf =
    () => runWith

  function concat(m) {
    if(!isSameType(Pred, m)) {
      throw new TypeError('Pred.concat: Pred required')
    }

    return Pred(x => !!runWith(x) && !!m.runWith(x))
  }

  function contramap(fn) {
    if(!isFunction(fn)) {
      throw new TypeError('Pred.contramap: Function required')
    }

    return Pred(compose(runWith, fn))
  }

  return {
    inspect, toString: inspect, runWith,
    type, valueOf, empty, concat, contramap,
    [fl.empty]: empty,
    [fl.concat]: concat,
    [fl.contramap]: contramap,
    ['@@type']: _type,
    constructor: Pred
  }
}

Pred.empty = _empty
Pred.type = type

Pred[fl.empty] = _empty
Pred['@@type'] = _type

Pred['@@implements'] = _implements(
  [ 'concat', 'contramap', 'empty' ]
)

export default Pred
