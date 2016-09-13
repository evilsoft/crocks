/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isType = require('../internal/isType')
const isFunction = require('../internal/isFunction')
const isUndefOrNull = require('../internal/isUndefOrNull')

const _inspect = require('../funcs/inspect')

const composeB = require('../combinators/composeB')
const constant = require('../combinators/constant')
const identity = require('../combinators/identity')

const _empty =
  () => Compose(identity)

const _type =
  constant('Compose')

function Compose(f) {
  const x = isUndefOrNull(f) ? _empty().value() : f

  if(!arguments.length || !isFunction(x)) {
    throw new TypeError('Compose: Function required')
  }

  const value =
    constant(x)

  const type =
    _type

  const empty =
    _empty

  const inspect =
    constant(`Compose${_inspect(value())}`)

  function concat(m) {
    if(!(m && isType(type(), m))) {
      throw new TypeError('Compose.concat: Compose required')
    }

    return Compose(composeB(x, m.value()))
  }

  return { inspect, value, type, concat, empty }
}

Compose.empty =
  _empty

Compose.type =
  _type

module.exports = Compose
