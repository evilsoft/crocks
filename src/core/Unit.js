/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const VERSION = 1

import _implements from './implements.js'
import types from './types.js'
const type = types.type('Unit')
import _types from './types.js'
const _type = _types.typeFn(type(), VERSION)
import fl from './flNames.js'

import isFunction from './isFunction.js'
import isSameType from './isSameType.js'

const _of =
  Unit

const _empty =
  Unit

function Unit() {
  const equals =
    m => isSameType(Unit, m)

  const inspect =
    () => '()'

  const valueOf =
    () => undefined

  const of =
    _of

  const empty =
    _empty

  function concat(m) {
    if(!isSameType(Unit, m)) {
      throw new TypeError('Unit.concat: Unit required')
    }

    return Unit()
  }

  function map(fn) {
    if(!isFunction(fn)) {
      throw new TypeError('Unit.map: Function required')
    }

    return Unit()
  }

  function ap(m) {
    if(!isSameType(Unit, m)) {
      throw new TypeError('Unit.ap: Unit required')
    }

    return Unit()
  }

  function chain(fn) {
    if(!isFunction(fn)) {
      throw new TypeError('Unit.chain: Function required')
    }

    return Unit()
  }

  return {
    inspect, toString: inspect, valueOf,
    type, equals, concat, empty, map, ap,
    of, chain,
    [fl.of]: of,
    [fl.empty]: empty,
    [fl.equals]: equals,
    [fl.concat]: concat,
    [fl.map]: map,
    [fl.chain]: chain,
    ['@@type']: _type,
    constructor: Unit
  }
}

Unit.of = _of
Unit.empty = _empty
Unit.type = type

Unit[fl.of] = _of
Unit[fl.empty] = _empty
Unit['@@type'] = _type

Unit['@@implements'] = _implements(
  [ 'ap', 'chain', 'concat', 'empty', 'equals', 'map', 'of' ]
)

export default Unit
