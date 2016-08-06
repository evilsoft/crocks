/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isFunction    = require('../internal/isFunction')
const isNumber      = require('../internal/isNumber')
const isType        = require('../internal/isType')
const isUndefOrNull = require('../internal/isUndefOrNull')

const _inspect = require('../funcs/inspect')

const constant = require('../combinators/constant')

const _empty  = () => Prod(1)
const _type   = constant('Prod')

function Prod(n) {
  const x = isUndefOrNull(n) ? _empty().value() : n

  if(!arguments.length || !isNumber(x)) {
    throw new TypeError('Prod: Numeric value required')
  }

  const value   = constant(x)
  const type    = _type
  const empty   = _empty

  const inspect = constant(`Prod${_inspect(value())}`)

  function concat(m) {
    if(!(m && isType(type(), m))) {
      throw new TypeError('Prod.concat: Prod required')
    }

    return Prod(x * m.value())
  }

  return { inspect, value, type, concat, empty }
}

Prod.empty = _empty
Prod.type  = _type

module.exports = Prod
