/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isType = require('../internal/isType')
const isNumber = require('../internal/isNumber')
const isNil = require('../internal/isNil')

const _inspect = require('../funcs/inspect')

const constant = require('../combinators/constant')

const _empty =
  () => Max(-Infinity)

const _type =
  constant('Max')

function Max(n) {
  const x = isNil(n) ? _empty().value() : n

  if(!arguments.length || !isNumber(x)) {
    throw new TypeError('Max: Numeric value required')
  }

  const value =
    constant(x)

  const type =
    _type

  const empty =
    _empty

  const inspect =
    constant(`Max${_inspect(value())}`)

  function concat(m) {
    if(!(m && isType(type(), m))) {
      throw new TypeError('Max.concat: Max requried')
    }

    return Max(Math.max(x, m.value()))
  }

  return { inspect, value, type, concat, empty }
}

Max.empty =
  _empty

Max.type =
  _type

module.exports = Max
