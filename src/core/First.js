/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const _implements = require('./implements')
const _inspect = require('./inspect')
const _type = require('../core/types').types('First')

const isSameType = require('./isSameType')

const Maybe = require('./Maybe')

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

  const type =
    _type

  const inspect =
    () => `First(${_inspect(maybe)} )`

  const value =
    () => maybe

  const option =
    maybe.option

  function concat(m) {
    if(!isSameType(First, m)) {
      throw new TypeError('First.concat: First required')
    }

    const n =
      m.value().map(x => x)

    return First(
      maybe.either(() => n, Maybe.Just)
    )
  }

  return {
    concat, empty, inspect,
    option, type, value
  }
}

First['@@implements'] = _implements(
  [ 'concat', 'empty' ]
)

First.empty =
  _empty

First.type =
  _type

module.exports = First
