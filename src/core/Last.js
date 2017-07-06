/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const _implements = require('./implements')
const _inspect = require('./inspect')
const constant = require('./constant')
const identity = require('./identity')
const isSameType = require('./isSameType')

const Maybe = require('./Maybe')

const _empty =
  () => Last(Maybe.Nothing())

const _type =
  constant('Last')

function Last(x) {
  if(!arguments.length) {
    throw new TypeError('Last: Requires one argument')
  }

  const maybe =
    !isSameType(Maybe, x) ? Maybe.of(x) : x.map(identity)

  const value =
    constant(maybe)

  const type =
    _type

  const empty =
    _empty

  const inspect =
    constant(`Last(${_inspect(maybe)} )`)

  const option =
    maybe.option

  function concat(m) {
    if(!isSameType(Last, m)) {
      throw new TypeError('Last.concat: Last required')
    }

    const n =
      m.value().map(identity)

    return Last(
      maybe.either(
        constant(n),
        constant(n.either(constant(maybe), constant(n)))
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
