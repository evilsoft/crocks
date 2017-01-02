/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isType = require('../internal/isType')
const isFunction = require('../internal/isFunction')
const isNil = require('../internal/isNil')

const _inspect = require('../funcs/inspect')

const constant = require('../combinators/constant')

const _type =
  constant('Any')

const _empty =
  () => Any(false)

function Any(b) {
  const x = isNil(b) ? _empty().value() : b

  if(!arguments.length || isFunction(x)) {
    throw new TypeError('Any: Non-function value required')
  }

  const value =
    constant(!!x)

  const type =
    _type

  const empty =
    _empty

  const inspect =
    constant(`Any${_inspect(value())}`)

  function concat(m) {
    if(!(m && isType(type(), m))) {
      throw new TypeError('Any.concat: Any required')
    }

    return Any(m.value() || value())
  }

  return { inspect, value, type, concat, empty }
}

Any.empty = _empty
Any.type  = _type

module.exports = Any
