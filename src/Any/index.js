/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const VERSION = 1

const _implements = require('../core/implements')
const _inspect = require('../core/inspect')
const type = require('../core/types').type('Any')
const _type = require('../core/types').typeFn(type(), VERSION)
const fl = require('../core/flNames')

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
    inspect, toString: inspect,
    valueOf, type, concat, empty,
    ['@@type']: _type,
    [fl.concat]: concat,
    [fl.empty]: empty,
    constructor: Any
  }
}

Any['@@implements'] = _implements(
  [ 'concat', 'empty' ]
)

Any.empty = _empty
Any.type  = type

Any[fl.empty] = _empty
Any['@@type'] = _type

module.exports = Any
