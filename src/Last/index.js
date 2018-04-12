/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const VERSION = 2

import _implements from '../core/implements.js'
import _inspect from '../core/inspect.js'
import _equals from '../core/equals.js'
import types from '../core/types.js'
const type = types.type('Last')
const _type = types.typeFn(type(), VERSION)
import fl from '../core/flNames.js'

import isSameType from '../core/isSameType.js'

import Maybe from '../core/Maybe.js'

const _empty =
  () => Last(Maybe.Nothing())

function Last(x) {
  if(!arguments.length) {
    throw new TypeError('Last: Requires one argument')
  }

  const maybe =
    !isSameType(Maybe, x) ? Maybe.of(x) : x.map(x => x)

  const valueOf =
    () => maybe

  const empty =
    _empty

  const inspect =
    () => `Last(${_inspect(maybe)} )`

  const equals =
  m => isSameType(Last, m)
    && _equals(maybe, m.valueOf())

  const option =
    maybe.option

  function concat(m) {
    if(!isSameType(Last, m)) {
      throw new TypeError('Last.concat: Last required')
    }

    const n =
      m.valueOf().map(x => x)

    return Last(
      maybe.either(
        () => n,
        () => n.either(() => maybe, () => n)
      )
    )
  }

  return {
    inspect, toString: inspect, concat,
    equals, empty, option, type, valueOf,
    [fl.equals]: equals,
    [fl.empty]: empty,
    [fl.concat]: concat,
    ['@@type']: _type,
    constructor: Last
  }
}

Last['@@implements'] = _implements(
  [ 'equals', 'concat', 'empty' ]
)

Last.empty = _empty
Last.type = type

Last[fl.empty] = _empty
Last['@@type'] = _type

export default Last
