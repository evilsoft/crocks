/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isFunction = require('../predicates/isFunction')
const isNil = require('../predicates/isNil')
const isSameType = require('../predicates/isSameType')

const _inspect = require('../internal/inspect')

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
    if(!isSameType(Any, m)) {
      throw new TypeError('Any.concat: Any required')
    }

    return Any(m.value() || value())
  }

  return { inspect, value, type, concat, empty }
}

Any.empty = _empty
Any.type  = _type

module.exports = Any
