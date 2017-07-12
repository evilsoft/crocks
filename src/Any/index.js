/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const _implements = require('../core/implements')
const _inspect = require('../core/inspect')
const constant = require('../core/constant')
const isFunction = require('../core/isFunction')
const isNil = require('../core/isNil')
const isSameType = require('../core/isSameType')

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

Any['@@implements'] = _implements(
  [ 'concat', 'empty' ]
)

Any.empty = _empty
Any.type  = _type

module.exports = Any
