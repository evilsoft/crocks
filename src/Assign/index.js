/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const VERSION = 2

import _implements from '../core/implements.js'
import _inspect from '../core/inspect.js'
import _object from '../core/object.js'
import _equals from '../core/equals.js'

import types from '../core/types.js'
const type = types.type('Assign')
const _type = types.typeFn(type(), VERSION)
import fl from '../core/flNames.js'

import isNil from '../core/isNil.js'
import isObject from '../core/isObject.js'
import isSameType from '../core/isSameType.js'

const _empty =
  () => Assign({})

function Assign(o) {
  const x = isNil(o) ? _empty().valueOf() : o

  if(!arguments.length || !isObject(x)) {
    throw new TypeError('Assign: Object required')
  }

  const valueOf =
    () => x

  const empty =
    _empty

  const inspect =
    () => `Assign${_inspect(valueOf())}`

  const equals =
    m => isSameType(Assign, m)
      && _equals(x, m.valueOf())

  function concat(m) {
    if(!isSameType(Assign, m)) {
      throw new TypeError('Assign.concat: Assign required')
    }

    return Assign(_object.assign(m.valueOf(), x))
  }

  return {
    inspect, toString: inspect, valueOf,
    equals, type, concat, empty,
    [fl.equals]: equals,
    [fl.empty]: empty,
    [fl.concat]: concat,
    ['@@type']: _type,
    constructor: Assign
  }
}

Assign['@@implements'] = _implements(
  [ 'equals', 'concat', 'empty' ]
)

Assign.empty = _empty
Assign.type = type

Assign[fl.empty] = _empty
Assign['@@type'] = _type

export default Assign
