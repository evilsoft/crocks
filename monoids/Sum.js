const isFunction  = require('../internal/isFunction')
const isType      = require('../internal/isType')

const constant = require('../combinators/constant')

const isNumber = x => typeof x === 'number'

const _empty  = () => Sum(0)
const _type   = constant('Sum')

function Sum(x) {
  if(!arguments.length || !isNumber(x)) {
    throw new TypeError('Sum: must wrap a numeric value')
  }

  const value   = constant(x)
  const type    = _type
  const empty   = _empty

  function concat(m) {
    if(!(m && isType(type(), m))) {
      throw new TypeError('Sum.concat: Arg must be another Sum')
    }

    return Sum(x + m.value())
  }

  return { value, type, concat, empty }
}

Sum.empty = _empty
Sum.type  = _type

module.exports = Sum
