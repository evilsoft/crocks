const isNumber      = require('../internal/isNumber')
const isUndefOrNull = require('../internal/isUndefOrNull')
const isType        = require('../internal/isType')

const constant = require('../combinators/constant')

const _empty  = () => Min(Infinity)
const _type   = constant('Min')

function Min(n) {
  const x = isUndefOrNull(n) ? _empty().value() : n

  if(!arguments.length || !isNumber(x)) {
    throw new TypeError('Min: must wrap a numeric value')
  }

  const value = constant(x)
  const type  = _type
  const empty = _empty

  function concat(m) {
    if(!(m && isType(type(), m))) {
      throw new TypeError('Min.concat: Arg must be another Min')
    }

    return Min(Math.min(x, m.value()))
  }

  return { value, type, concat, empty }
}

Min.empty = _empty
Min.type  = _type

module.exports = Min
