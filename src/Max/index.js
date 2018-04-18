/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const VERSION = 2

import _implements from '../core/implements.js'
import _inspect from '../core/inspect.js'
import _equals from '../core/equals.js'
import types from '../core/types.js'
const type = types.type('Max')
const _type = types.typeFn(type(), VERSION)
import fl from '../core/flNames.js'

import isNil from '../core/isNil.js'
import isNumber from '../core/isNumber.js'
import isSameType from '../core/isSameType.js'

const _empty =
  () => Max(-Infinity)

function Max(n) {
  const x = isNil(n) ? _empty().valueOf() : n

  if(!arguments.length || !isNumber(x)) {
    throw new TypeError('Max: Numeric value required')
  }

  const valueOf =
    () => x

  const empty =
    _empty

  const inspect =
    () => `Max${_inspect(valueOf())}`

  const equals =
    m => isSameType(Max, m)
      && _equals(x, m.valueOf())

  function concat(method) {
    return function(m) {
      if(!isSameType(Max, m)) {
        throw new TypeError(`Max.${method}: Max requried`)
      }

      return Max(Math.max(x, m.valueOf()))
    }
  }

  return {
    inspect, toString: inspect,
    equals, valueOf, type, empty,
    concat: concat('concat'),
    [fl.equals]: equals,
    [fl.empty]: empty,
    [fl.concat]: concat(fl.concat),
    ['@@type']: _type,
    constructor: Max
  }
}

Max['@@implements'] = _implements(
  [ 'equals', 'concat', 'empty' ]
)

Max.empty = _empty
Max.type = type

Max[fl.empty] = _empty
Max['@@type'] = _type

export default Max
