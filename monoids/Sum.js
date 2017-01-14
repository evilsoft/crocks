/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isType = require('../internal/isType')

const isFunction = require('../predicates/isFunction')
const isNil = require('../predicates/isNil')
const isNumber = require('../predicates/isNumber')

const _inspect = require('../internal/inspect')

const constant = require('../combinators/constant')

const _empty =
  () => Sum(0)

const _type =
  constant('Sum')

function Sum(n) {
  const x = isNil(n) ? _empty().value() : n

  if(!arguments.length || !isNumber(x)) {
    throw new TypeError('Sum: Numeric value required')
  }

  const value =
    constant(x)

  const type =
    _type

  const empty=
    _empty

  const inspect =
    constant(`Sum${_inspect(value())}`)

  function concat(m) {
    if(!(m && isType(type(), m))) {
      throw new TypeError('Sum.concat: Sum required')
    }

    return Sum(x + m.value())
  }

  return { inspect, value, type, concat, empty }
}

Sum.empty =
  _empty

Sum.type =
  _type

module.exports = Sum
