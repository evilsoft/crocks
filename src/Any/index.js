/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const _implements = require('../core/implements')
const _inspect = require('../core/inspect')
const type = require('../core/types').type('Any')

const isFunction = require('../core/isFunction')
const isNil = require('../core/isNil')
const isSameType = require('../core/isSameType')

const _empty =
  () => Any(false)

function Any(b) {
  const x = isNil(b) ? _empty().valueOf() : b

  if(!arguments.length || isFunction(x)) {
    throw new TypeError('Any: Non-function value required')
  }

  const valueOf =
    () => !!x

  const empty =
    _empty

  const inspect =
    () => `Any${_inspect(valueOf())}`

  function concat(m) {
    if(!isSameType(Any, m)) {
      throw new TypeError('Any.concat: Any required')
    }

    return Any(m.valueOf() || valueOf())
  }

  return {
    inspect, valueOf, type,
    concat, empty,
    constructor: Any
  }
}

Any['@@implements'] = _implements(
  [ 'concat', 'empty' ]
)

Any.empty = _empty
Any.type  = type

module.exports = Any
