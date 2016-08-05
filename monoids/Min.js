const isNumber      = require('../internal/isNumber')
const isUndefOrNull = require('../internal/isUndefOrNull')
const isType        = require('../internal/isType')

const _inspect = require('../funcs/inspect')

const constant = require('../combinators/constant')

const _empty  = () => Min(Infinity)
const _type   = constant('Min')

function Min(n) {
  const x = isUndefOrNull(n) ? _empty().value() : n

  if(!arguments.length || !isNumber(x)) {
    throw new TypeError('Min: Numeric value required')
  }

  const value = constant(x)
  const type  = _type
  const empty = _empty

  const inspect = constant(`Min${_inspect(value())}`)

  function concat(m) {
    if(!(m && isType(type(), m))) {
      throw new TypeError('Min.concat: Min required')
    }

    return Min(Math.min(x, m.value()))
  }

  return { inspect, value, type, concat, empty }
}

Min.empty = _empty
Min.type  = _type

module.exports = Min
