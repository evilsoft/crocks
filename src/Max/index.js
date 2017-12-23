/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const _implements = require('../core/implements')
const _inspect = require('../core/inspect')
const type = require('../core/types').type('Max')

const isNil = require('../core/isNil')
const isNumber = require('../core/isNumber')
const isSameType = require('../core/isSameType')

const _empty =
  () => Max(-Infinity)

function Max(n) {
  const x = isNil(n) ? _empty().valueOf() : n

  if(!arguments.length || !isNumber(x)) {
    throw new TypeError('Max: Numeric value required')
  }

  const valueOf =
    () => x

  const empty =
    _empty

  const inspect =
    () => `Max${_inspect(valueOf())}`

  function concat(m) {
    if(!isSameType(Max, m)) {
      throw new TypeError('Max.concat: Max requried')
    }

    return Max(Math.max(x, m.valueOf()))
  }

  return {
    inspect, valueOf, type,
    concat, empty,
    constructor: Max
  }
}

Max['@@implements'] = _implements(
  [ 'concat', 'empty' ]
)

Max.empty = _empty
Max.type = type

module.exports = Max
