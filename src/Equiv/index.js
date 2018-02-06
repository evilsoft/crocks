/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const VERSION = 1

const _implements = require('../core/implements')
const _inspect = require('../core/inspect')

const curry = require('../core/curry')
const isFunction = require('../core/isFunction')
const isSameType = require('../core/isSameType')

const type = require('../core/types').type('Equiv')
const _type = require('../core/types').typeFn(type(), VERSION)

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

  function contramap(fn) {
    if(!isFunction(fn)) {
      throw new TypeError('Equiv.contramap: Function required')
    }

    return Equiv(
      (x, y) => compareWith(fn(x), fn(y))
    )
  }

  function concat(m) {
    if(!isSameType(Equiv, m)) {
      throw new TypeError('Equiv.concat: Equiv required')
    }

    return Equiv((x, y) =>
      compareWith(x, y) && m.compareWith(x, y)
    )
  }

  return {
    inspect, toString: inspect, type,
    compareWith, valueOf, contramap,
    concat, empty,
    'fantasy-land/empty': empty,
    'fantasy-land/concat': concat,
    'fantasy-land/contramap': contramap,
    '@@type': _type,
    constructor: Equiv
  }
}

Equiv.empty = _empty
Equiv.type = type

Equiv['fantasy-land/empty'] = _empty
Equiv['@@type'] = _type

Equiv['@@implements'] = _implements(
  [ 'concat', 'contramap', 'empty' ]
)

module.exports = Equiv
