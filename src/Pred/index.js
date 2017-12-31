/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const _implements = require('../core/implements')
const _inspect = require('../core/inspect')
const type = require('../core/types').type('Pred')

const compose = require('../core/compose')
const isFunction = require('../core/isFunction')
const isSameType = require('../core/isSameType')

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
    runWith, inspect, type, valueOf,
    empty, concat, contramap,
    constructor: Pred
  }
}

Pred.empty = _empty
Pred.type = type

Pred['@@implements'] = _implements(
  [ 'concat', 'contramap', 'empty' ]
)

module.exports = Pred
