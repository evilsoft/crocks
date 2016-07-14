const isFunction  = require('../internal/isFunction')
const isType      = require('../internal/isType')

const constant = require('../combinators/constant')

const _type   = constant('Any')
const _empty  = () => Any(false)

function Any(x) {
  if(!arguments.length || isFunction(x)) {
    throw new TypeError('Any: Must wrap a non-function value')
  }

  const value = constant(!!x)
  const type  = _type
  const empty = _empty

  function concat(m) {
    if(!(m && isType(type(), m))) {
      throw new TypeError('Any.concat: Arg must be another Any')
    }

    return Any(m.value() || value())
  }

  return { value, type, concat, empty }
}

Any.empty = _empty
Any.type  = _type

module.exports = Any
