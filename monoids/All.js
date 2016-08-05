const isFunction    = require('../internal/isFunction')
const isType        = require('../internal/isType')
const isUndefOrNull = require('../internal/isUndefOrNull')

const constant = require('../combinators/constant')

const _empty  = () => All(true)
const _type   = constant('All')

function All(b) {
  const x = isUndefOrNull(b) ? _empty().value() : b

  if(!arguments.length || isFunction(x)) {
    throw new TypeError('All: Non-function value required')
  }

  const value = constant(!!x)
  const type  = _type
  const empty = _empty

  function concat(m) {
    if(!(m && isType(type(), m))) {
      throw new TypeError('All.concat: All required')
    }

    return All(m.value() && value())
  }

  return { value, type, concat, empty }
}

All.empty = _empty
All.type  = _type

module.exports = All
