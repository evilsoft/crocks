/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const VERSION = 2

import _implements from '../core/implements.js'
import _inspect from '../core/inspect.js'
import _equals from '../core/equals.js'
import types from '../core/types.js'
const type = types.type('All')
const _type = types.typeFn(type(), VERSION)
import fl from '../core/flNames.js'

import isFunction from '../core/isFunction.js'
import isNil from '../core/isNil.js'
import isSameType from '../core/isSameType.js'

const _empty =
  () => All(true)

function All(b) {
  const x = isNil(b) ? _empty().valueOf() : b

  if(!arguments.length || isFunction(x)) {
    throw new TypeError('All: Non-function value required')
  }

  const valueOf =
    () => !!x

  const empty =
    _empty

  const equals =
    m => isSameType(All, m)
      && _equals(x, m.valueOf())

  const inspect =
    () => `All${_inspect(valueOf())}`

  function concat(method) {
    return function(m) {
      if(!isSameType(All, m)) {
        throw new TypeError(`All.${method}: All required`)
      }

      return All(m.valueOf() && valueOf())
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
    constructor: All
  }
}

All['@@implements'] = _implements(
  [ 'equals', 'concat', 'empty' ]
)

All.empty = _empty
All.type = type

All[fl.empty] = _empty
All['@@type'] = _type

export default All
