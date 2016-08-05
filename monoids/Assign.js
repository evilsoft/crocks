const isFunction    = require('../internal/isFunction')
const isType        = require('../internal/isType')
const isUndefOrNull = require('../internal/isUndefOrNull')
const isObject      = require('../internal/isObject')

const _inspect = require('../funcs/inspect')

const constant = require('../combinators/constant')

const _empty  = () => Assign({})
const _type   = constant('Assign')

function Assign(o) {
  const x = isUndefOrNull(o) ? _empty().value() : o

  if(!arguments.length || !isObject(x)) {
    throw new TypeError('Assign: Object required')
  }

  const value   = constant(x)
  const type    = _type
  const empty   = _empty

  const inspect = constant(`Assign${_inspect(value())}`)

  function concat(m) {
    if(!(m && isType(type(), m))) {
      throw new TypeError('Assign.concat: Assign required')
    }

    return Assign(Object.assign({}, x, m.value()))
  }

  return { inspect, value, type, concat, empty }
}

Assign.empty = _empty
Assign.type  = _type

module.exports = Assign
