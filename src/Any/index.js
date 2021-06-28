/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const VERSION = 2

const _implements = require('../core/implements')
const _inspect = require('../core/inspect')
const _equals = require('../core/equals')
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
    throw new TypeError('Any: Value must not be a Function')
  }

  const valueOf =
    () => !!x

  const empty =
    _empty

  const inspect =
    () => `Any${_inspect(valueOf())}`

  const equals =
    m => isSameType(Any, m)
      && _equals(x, m.valueOf())

  function concat(method) {
    return function(m) {
      if(!isSameType(Any, m)) {
        throw new TypeError(`Any.${method}: Any required`)
      }

      return Any(m.valueOf() || valueOf())
    }
  }

  return {
    inspect, toString: inspect,
    equals, valueOf, type, empty,
    ['@@type']: _type,
    concat: concat('concat'),
    [fl.equals]: equals,
    [fl.concat]: concat(fl.concat),
    [fl.empty]: empty,
    constructor: Any
  }
}

Any['@@implements'] = _implements(
  [ 'equals', 'concat', 'empty' ]
)

Any.empty = _empty
Any.type  = type

Any[fl.empty] = _empty
Any['@@type'] = _type

module.exports = Any
