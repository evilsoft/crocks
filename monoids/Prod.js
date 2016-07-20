const isFunction  = require('../internal/isFunction')
const isNumber    = require('../internal/isNumber')
const isType      = require('../internal/isType')

const constant = require('../combinators/constant')

const _empty  = () => Prod(1)
const _type   = constant('Prod')

function Prod(x) {
  if(!arguments.length || !isNumber(x)) {
    throw new TypeError('Prod: must wrap a numeric value')
  }

  const value   = constant(x)
  const type    = _type
  const empty   = _empty

  function concat(m) {
    if(!(m && isType(type(), m))) {
      throw new TypeError('Prod.concat: Arg must be another Prod')
    }

    return Prod(x * m.value())
  }

  return { value, type, concat, empty }
}

Prod.empty = _empty
Prod.type  = _type

module.exports = Prod
