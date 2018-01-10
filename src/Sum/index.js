/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const _implements = require('../core/implements')
const _inspect = require('../core/inspect')
const type = require('../core/types').type('Sum')

const isNil = require('../core/isNil')
const isNumber = require('../core/isNumber')
const isSameType = require('../core/isSameType')

const _empty =
  () => Sum(0)

function Sum(n) {
  const x = isNil(n) ? _empty().valueOf() : n

  if(!arguments.length || !isNumber(x)) {
    throw new TypeError('Sum: Numeric value required')
  }

  const valueOf =
    () => x

  const empty=
    _empty

  const inspect =
    () => `Sum${_inspect(valueOf())}`

  function concat(m) {
    if(!isSameType(Sum, m)) {
      throw new TypeError('Sum.concat: Sum required')
    }

    return Sum(x + m.valueOf())
  }

  return {
    inspect, valueOf, type,
    concat, empty,
    constructor: Sum
  }
}

Sum['@@implements'] = _implements(
  [ 'concat', 'empty' ]
)

Sum.empty = _empty
Sum.type = type

module.exports = Sum
