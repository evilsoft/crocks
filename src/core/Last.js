/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const _implements = require('./implements')
const _inspect = require('./inspect')
const _type = require('../core/types').types('Last')

const isSameType = require('./isSameType')

const Maybe = require('./Maybe')

const _empty =
  () => Last(Maybe.Nothing())

function Last(x) {
  if(!arguments.length) {
    throw new TypeError('Last: Requires one argument')
  }

  const maybe =
    !isSameType(Maybe, x) ? Maybe.of(x) : x.map(x => x)

  const value =
    () => maybe

  const type =
    _type

  const empty =
    _empty

  const inspect =
    () => `Last(${_inspect(maybe)} )`

  const option =
    maybe.option

  function concat(m) {
    if(!isSameType(Last, m)) {
      throw new TypeError('Last.concat: Last required')
    }

    const n =
      m.value().map(x => x)

    return Last(
      maybe.either(
        () => n,
        () => n.either(() => maybe, () => n)
      )
    )
  }

  return {
    concat, empty, inspect, option, type, value
  }
}

Last['@@implements'] = _implements(
  [ 'concat', 'empty' ]
)

Last.empty =
  _empty

Last.type =
  _type

module.exports = Last
