/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const VERSION = 1

const _implements = require('../core/implements')
const _inspect = require('../core/inspect')
const type = require('../core/types').type('First')
const _type = require('../core/types').typeFn(type(), VERSION)

const isSameType = require('../core/isSameType')

const Maybe = require('../core/Maybe')

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

  const valueOf =
    () => maybe

  const option =
    maybe.option

  function concat(m) {
    if(!isSameType(First, m)) {
      throw new TypeError('First.concat: First required')
    }

    const n =
      m.valueOf().map(x => x)

    return First(
      maybe.either(() => n, Maybe.Just)
    )
  }

  return {
    inspect, toString: inspect,
    concat, empty, option, type,
    valueOf,
    'fantasy-land/empty': _empty,
    'fantasy-land/concat': concat,
    '@@type': _type,
    constructor: First
  }
}

First['@@implements'] = _implements(
  [ 'concat', 'empty' ]
)

First.empty = _empty
First.type = type

First['fantasy-land/empty'] = _empty
First['@@type'] = _type

module.exports = First
