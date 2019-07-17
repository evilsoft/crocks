/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const VERSION = 2

const _implements = require('./implements')
const _inspect = require('./inspect')
const type = require('./types').type('Pred')
const _type = require('./types').typeFn(type(), VERSION)
const fl = require('./flNames')

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
