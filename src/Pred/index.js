/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const VERSION = 2

const _implements = require('../core/implements')
const _inspect = require('../core/inspect')
const type = require('../core/types').type('Pred')
const _type = require('../core/types').typeFn(type(), VERSION)
const fl = require('../core/flNames')

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

Pred.empty = _empty
Pred.type = type

Pred[fl.empty] = _empty
Pred['@@type'] = _type

Pred['@@implements'] = _implements(
  [ 'concat', 'contramap', 'empty' ]
)

module.exports = Pred
