/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const VERSION = 2

import _implements from '../core/implements.js'
import _inspect from '../core/inspect.js'
import _equals from '../core/equals.js'
import types from '../core/types.js'
const type = types.type('Min')
const _type = types.typeFn(type(), VERSION)
import fl from '../core/flNames.js'

import isNil from '../core/isNil.js'
import isNumber from '../core/isNumber.js'
import isSameType from '../core/isSameType.js'

const _empty =
  () => Min(Infinity)

function Min(n) {
  const x = isNil(n) ? _empty().valueOf() : n

  if(!arguments.length || !isNumber(x)) {
    throw new TypeError('Min: Numeric value required')
  }

  const valueOf =
    () => x

  const empty =
    _empty

  const inspect =
    () => `Min${_inspect(valueOf())}`

  const equals =
    m => isSameType(Min, m)
      && _equals(x, m.valueOf())

  function concat(m) {
    if(!isSameType(Min, m)) {
      throw new TypeError('Min.concat: Min required')
    }

    return Min(Math.min(x, m.valueOf()))
  }

  return {
    inspect, toString: inspect, valueOf,
    equals, type, concat, empty,
    [fl.equals]: equals,
    [fl.empty]: empty,
    [fl.concat]: concat,
    ['@@type']: _type,
    constructor: Min
  }
}

Min['@@implements'] = _implements(
  [ 'equals', 'concat', 'empty' ]
)

Min.empty = _empty
Min.type = type

Min[fl.empty] = _empty
Min['@@type'] = _type

export default Min
