/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const _implements = require('./implements')
const _inspect = require('./inspect')
const _type = require('../core/types').types('Pred')

const compose = require('./compose')
const isFunction = require('./isFunction')
const isSameType = require('./isSameType')

const _empty =
  () => Pred(() => true)

function Pred(pred) {
  if(!isFunction(pred)) {
    throw new TypeError('Pred: Predicate function required')
  }

  const runWith =
    x => !!pred(x)

  const type =
    _type

  const inspect =
    () => `Pred${_inspect(runWith)}`

  const empty =
    _empty

  const value =
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
    runWith, inspect, type,
    value, empty, concat,
    contramap
  }
}

Pred.empty = _empty
Pred.type = _type

Pred['@@implements'] = _implements(
  [ 'concat', 'contramap', 'empty' ]
)

module.exports = Pred
