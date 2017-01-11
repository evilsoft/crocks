/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isFunction = require('../internal/isFunction')
const isType = require('../internal/isType')

const _inspect = require('../internal/inspect')

const constant = require('../combinators/constant')
const composeB = require('../combinators/composeB')

const _type =
  constant('Pred')

const _empty =
  () => Pred(constant(true))

function Pred(runWith) {
  if(!isFunction(runWith)) {
    throw new TypeError('Pred: Predicate function required')
  }

  const type =
    _type

  const inspect =
    constant(`Pred${_inspect(runWith)}`)

  const empty =
    _empty

  const value =
    constant(runWith)

  function concat(m) {
    if(!(m && isType(type(), m))) {
      throw new TypeError('Pred.concat: Pred required')
    }

    return Pred(x => runWith(x) && m.runWith(x))
  }

  function contramap(fn) {
    if(!isFunction(fn)) {
      throw new TypeError('Pred.contramap: Function required')
    }

    return Pred(composeB(runWith, fn))
  }

  return {
    runWith, inspect, type,
    value, empty, concat,
    contramap
  }
}

Pred.empty = _empty
Pred.type = _type

module.exports = Pred
