/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isFunction = require('../predicates/isFunction')
const isSameType = require('../predicates/isSameType')

const _inspect = require('../internal/inspect')

const composeB = require('../combinators/composeB')
const constant = require('../combinators/constant')
const identity = require('../combinators/identity')

const _empty =
  () => Endo(identity)

const _type =
  constant('Endo')

function Endo(runWith) {
  if(!isFunction(runWith)) {
    throw new TypeError('Endo: Function value required')
  }

  const value =
    constant(runWith)

  const type =
    _type

  const empty =
    _empty

  const inspect =
    constant(`Endo${_inspect(value())}`)

  function concat(m) {
    if(!isSameType(Endo, m)) {
      throw new TypeError('Endo.concat: Endo required')
    }

    return Endo(composeB(m.value(), value()))
  }

  return { inspect, value, type, concat, empty, runWith }
}

Endo.empty =
  _empty

Endo.type =
  _type

module.exports = Endo

