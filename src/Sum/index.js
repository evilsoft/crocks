/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const VERSION = 2

import _implements from '../core/implements.js'
import _inspect from '../core/inspect.js'
import _equals from '../core/equals.js'
import types from '../core/types.js'
const type = types.type('Sum')
const _type = types.typeFn(type(), VERSION)
import fl from '../core/flNames.js'

import isNil from '../core/isNil.js'
import isNumber from '../core/isNumber.js'
import isSameType from '../core/isSameType.js'

const _empty =
  () => Sum(0)

function Sum(n) {
  const x = isNil(n) ? _empty().valueOf() : n

  if(!arguments.length || !isNumber(x)) {
    throw new TypeError('Sum: Numeric value required')
  }

  const valueOf =
    () => x

  const empty=
    _empty

  const inspect =
    () => `Sum${_inspect(valueOf())}`

  const equals =
    m => isSameType(Sum, m)
      && _equals(x, m.valueOf())

  function concat(m) {
    if(!isSameType(Sum, m)) {
      throw new TypeError('Sum.concat: Sum required')
    }

    return Sum(x + m.valueOf())
  }

  return {
    inspect, toString: inspect, valueOf,
    equals, type, concat, empty,
    [fl.equals]: equals,
    [fl.empty]: empty,
    [fl.concat]: concat,
    ['@@type']: _type,
    constructor: Sum
  }
}

Sum['@@implements'] = _implements(
  [ 'equals', 'concat', 'empty' ]
)

Sum.empty = _empty
Sum.type = type

Sum[fl.empty] = _empty
Sum['@@type'] = _type

export default Sum
