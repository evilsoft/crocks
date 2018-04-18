/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const VERSION = 2

import _implements from '../core/implements.js'
import _inspect from '../core/inspect.js'
import _equals from '../core/equals.js'
import types from '../core/types.js'
const type = types.type('Any')
const _type = types.typeFn(type(), VERSION)
import fl from '../core/flNames.js'

import isFunction from '../core/isFunction.js'
import isNil from '../core/isNil.js'
import isSameType from '../core/isSameType.js'

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

export default Any
