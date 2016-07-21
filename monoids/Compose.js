const isFunction    = require('../internal/isFunction')
const isType        = require('../internal/isType')
const isUndefOrNull = require('../internal/isUndefOrNull')

const composeB = require('../combinators/composeB')
const constant = require('../combinators/constant')
const identity = require('../combinators/identity')

const _empty  = () => Compose(identity)
const _type   = constant('Compose')

function Compose(f) {
  const x = isUndefOrNull(f) ? _empty().value() : f

  if(!arguments.length || !isFunction(x)) {
    throw new TypeError('Compose: Requires a function')
  }

  const value   = constant(x)
  const type    = _type
  const empty   = _empty

  function concat(m) {
    if(!(m && isType(type(), m))) {
      throw new TypeError('Compose.concat: Requires another Compose')
    }

    return Compose(composeB(x, m.value()))
  }

  return { value, type, concat, empty }
}

Compose.empty = _empty
Compose.type  = _type

module.exports = Compose
