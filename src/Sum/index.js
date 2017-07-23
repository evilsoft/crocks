/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const _implements = require('../core/implements')
const _inspect = require('../core/inspect')
const _type = require('../core/types').types('Sum')

const isNil = require('../core/isNil')
const isNumber = require('../core/isNumber')
const isSameType = require('../core/isSameType')

const _empty =
  () => Sum(0)

function Sum(n) {
  const x = isNil(n) ? _empty().value() : n

  if(!arguments.length || !isNumber(x)) {
    throw new TypeError('Sum: Numeric value required')
  }

  const value =
    () => x

  const type =
    _type

  const empty=
    _empty

  const inspect =
    () => `Sum${_inspect(value())}`

  function concat(m) {
    if(!isSameType(Sum, m)) {
      throw new TypeError('Sum.concat: Sum required')
    }

    return Sum(x + m.value())
  }

  return { inspect, value, type, concat, empty }
}

Sum['@@implements'] = _implements(
  [ 'concat', 'empty' ]
)

Sum.empty =
  _empty

Sum.type =
  _type

module.exports = Sum
