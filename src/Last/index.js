/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const _implements = require('../core/implements')
const _inspect = require('../core/inspect')
const type = require('../core/types').type('Last')

const isSameType = require('../core/isSameType')

const Maybe = require('../core/Maybe')

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
    concat, empty, inspect,
    option, type, valueOf,
    constructor: Last
  }
}

Last['@@implements'] = _implements(
  [ 'concat', 'empty' ]
)

Last.empty =
  _empty

Last.type =
  type

module.exports = Last
