const isNumber      = require('../internal/isNumber')
const isUndefOrNull = require('../internal/isUndefOrNull')
const isType        = require('../internal/isType')

const constant = require('../combinators/constant')

const _empty  = () => Max(-Infinity)
const _type   = constant('Max')

function Max(n) {
  const x = isUndefOrNull(n) ? _empty().value() : n

  if(!arguments.length || !isNumber(x)) {
    throw new TypeError('Max: Numeric value required')
  }

  const value = constant(x)
  const type  = _type
  const empty = _empty

  function concat(m) {
    if(!(m && isType(type(), m))) {
      throw new TypeError('Max.concat: Max requried')
    }

    return Max(Math.max(x, m.value()))
  }

  return { value, type, concat, empty }
}

Max.empty = _empty
Max.type  = _type

module.exports = Max
