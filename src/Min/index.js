/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const _implements = require('../core/implements')
const _inspect = require('../core/inspect')
const _type = require('../core/types').types('Min')

const isNil = require('../core/isNil')
const isNumber = require('../core/isNumber')
const isSameType = require('../core/isSameType')

const _empty =
  () => Min(Infinity)

function Min(n) {
  const x = isNil(n) ? _empty().value() : n

  if(!arguments.length || !isNumber(x)) {
    throw new TypeError('Min: Numeric value required')
  }

  const value =
    () => x

  const type =
    _type

  const empty =
    _empty

  const inspect =
    () => `Min${_inspect(value())}`

  function concat(m) {
    if(!isSameType(Min, m)) {
      throw new TypeError('Min.concat: Min required')
    }

    return Min(Math.min(x, m.value()))
  }

  return { inspect, value, type, concat, empty }
}

Min['@@implements'] = _implements(
  [ 'concat', 'empty' ]
)

Min.empty =
  _empty

Min.type =
  _type

module.exports = Min
