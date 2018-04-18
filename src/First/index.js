/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const VERSION = 2

import _implements from '../core/implements.js'
import _inspect from '../core/inspect.js'
import _equals from '../core/equals.js'
import types from '../core/types.js'
const type = types.type('First')
const _type = types.typeFn(type(), VERSION)
import fl from '../core/flNames.js'

import isSameType from '../core/isSameType.js'

import Maybe from '../core/Maybe.js'

const _empty =
  () => First(Maybe.Nothing())

function First(x) {
  if(!arguments.length) {
    throw new TypeError('First: Requires one argument')
  }

  const maybe =
    !isSameType(Maybe, x) ? Maybe.of(x) : x.map(x => x)

  const empty =
    _empty

  const inspect =
    () => `First(${_inspect(maybe)} )`

  const equals =
  m => isSameType(First, m)
    && _equals(maybe, m.valueOf())

  const valueOf =
    () => maybe

  const option =
    maybe.option

  function concat(method) {
    return function(m) {
      if(!isSameType(First, m)) {
        throw new TypeError(`First.${method}: First required`)
      }

      const n =
        m.valueOf().map(x => x)

      return First(
        maybe.either(() => n, Maybe.Just)
      )
    }
  }

  return {
    inspect, toString: inspect,
    equals, empty, option, type, valueOf,
    concat: concat('concat'),
    [fl.equals]: equals,
    [fl.empty]: _empty,
    [fl.concat]: concat(fl.concat),
    ['@@type']: _type,
    constructor: First
  }
}

First['@@implements'] = _implements(
  [ 'equals', 'concat', 'empty' ]
)

First.empty = _empty
First.type = type

First[fl.empty] = _empty
First['@@type'] = _type

export default First
