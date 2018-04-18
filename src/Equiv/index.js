/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const VERSION = 2

import _implements from '../core/implements.js'
import _inspect from '../core/inspect.js'

import curry from '../core/curry.js'
import isFunction from '../core/isFunction.js'
import isSameType from '../core/isSameType.js'

import types from '../core/types.js'
const type = types.type('Equiv')
const _type = types.typeFn(type(), VERSION)
import fl from '../core/flNames.js'

const _empty =
  () => Equiv(() => true)

function Equiv(compare) {
  if(!isFunction(compare)) {
    throw new TypeError('Equiv: Comparison function required')
  }

  const compareWith = curry(
    (x, y) => !!compare(x, y)
  )

  const inspect =
    () => `Equiv${_inspect(compare)}`

  const empty =
    _empty

  const valueOf =
    () => compareWith

  function contramap(method) {
    return function(fn) {
      if(!isFunction(fn)) {
        throw new TypeError(`Equiv.${method}: Function required`)
      }

      return Equiv(
        (x, y) => compareWith(fn(x), fn(y))
      )
    }
  }

  function concat(method) {
    return function(m) {
      if(!isSameType(Equiv, m)) {
        throw new TypeError(`Equiv.${method}: Equiv required`)
      }

      return Equiv((x, y) =>
        compareWith(x, y) && m.compareWith(x, y)
      )
    }
  }

  return {
    inspect, toString: inspect, type,
    compareWith, valueOf, empty,
    concat: concat('concat'),
    contramap: contramap('contramap'),
    [fl.empty]: empty,
    [fl.concat]: concat(fl.concat),
    [fl.contramap]: contramap(fl.contramap),
    ['@@type']: _type,
    constructor: Equiv
  }
}

Equiv.empty = _empty
Equiv.type = type

Equiv[fl.empty] = _empty
Equiv['@@type'] = _type

Equiv['@@implements'] = _implements(
  [ 'concat', 'contramap', 'empty' ]
)

export default Equiv
