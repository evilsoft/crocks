const isFunction  = require('../internal/isFunction')
const isType      = require('../internal/isType')

const constant = require('../combinators/constant')

const _type   = constant('All')
const _empty  = () => All(true)

function All(x) {
  if(!arguments.length || isFunction(x)) {
    throw new TypeError('All: Must wrap a non-function value')
  }

  const value = constant(!!x)
  const type  = _type
  const empty = _empty

  function concat(m) {
    if(!(m && isType(type(), m))) {
      throw new TypeError('All.concat: Arg must be another All')
    }

    return All(m.value() && value())
  }

  return { value, type, concat, empty }
}

All.empty = _empty
All.type  = _type

module.exports = All
