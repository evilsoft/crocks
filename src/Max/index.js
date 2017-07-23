/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const _implements = require('../core/implements')
const _inspect = require('../core/inspect')
const _type = require('../core/types').types('Max')

const isNil = require('../core/isNil')
const isNumber = require('../core/isNumber')
const isSameType = require('../core/isSameType')

const _empty =
  () => Max(-Infinity)

function Max(n) {
  const x = isNil(n) ? _empty().value() : n

  if(!arguments.length || !isNumber(x)) {
    throw new TypeError('Max: Numeric value required')
  }

  const value =
    () => x

  const type =
    _type

  const empty =
    _empty

  const inspect =
    () => `Max${_inspect(value())}`

  function concat(m) {
    if(!isSameType(Max, m)) {
      throw new TypeError('Max.concat: Max requried')
    }

    return Max(Math.max(x, m.value()))
  }

  return { inspect, value, type, concat, empty }
}

Max['@@implements'] = _implements(
  [ 'concat', 'empty' ]
)

Max.empty =
  _empty

Max.type =
  _type

module.exports = Max
