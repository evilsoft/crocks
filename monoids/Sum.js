const isFunction    = require('../internal/isFunction')
const isNumber      = require('../internal/isNumber')
const isType        = require('../internal/isType')
const isUndefOrNull = require('../internal/isUndefOrNull')

const constant = require('../combinators/constant')

const _empty  = () => Sum(0)
const _type   = constant('Sum')

function Sum(n) {
  const x = isUndefOrNull(n) ? _empty().value() : n

  if(!arguments.length || !isNumber(x)) {
    throw new TypeError('Sum: Numeric value required')
  }

  const value   = constant(x)
  const type    = _type
  const empty   = _empty

  function concat(m) {
    if(!(m && isType(type(), m))) {
      throw new TypeError('Sum.concat: Sum required')
    }

    return Sum(x + m.value())
  }

  return { value, type, concat, empty }
}

Sum.empty = _empty
Sum.type  = _type

module.exports = Sum
