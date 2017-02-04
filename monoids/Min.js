/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isNil = require('../predicates/isNil')
const isNumber = require('../predicates/isNumber')
const isSameType = require('../predicates/isSameType')

const _inspect = require('../internal/inspect')

const constant = require('../combinators/constant')

const _empty =
  () => Min(Infinity)

const _type =
  constant('Min')

function Min(n) {
  const x = isNil(n) ? _empty().value() : n

  if(!arguments.length || !isNumber(x)) {
    throw new TypeError('Min: Numeric value required')
  }

  const value =
    constant(x)

  const type =
    _type

  const empty =
    _empty

  const inspect =
    constant(`Min${_inspect(value())}`)

  function concat(m) {
    if(!isSameType(Min, m)) {
      throw new TypeError('Min.concat: Min required')
    }

    return Min(Math.min(x, m.value()))
  }

  return { inspect, value, type, concat, empty }
}

Min.empty =
  _empty

Min.type =
  _type

module.exports = Min
