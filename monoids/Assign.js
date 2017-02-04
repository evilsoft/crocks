/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isFunction = require('../predicates/isFunction')
const isNil = require('../predicates/isNil')
const isObject = require('../predicates/isObject')
const isSameType = require('../predicates/isSameType')

const _inspect = require('../internal/inspect')

const constant = require('../combinators/constant')

const _empty =
  () => Assign({})

const _type =
  constant('Assign')

function Assign(o) {
  const x = isNil(o) ? _empty().value() : o

  if(!arguments.length || !isObject(x)) {
    throw new TypeError('Assign: Object required')
  }

  const value =
    constant(x)

  const type =
    _type

  const empty =
    _empty

  const inspect =
    constant(`Assign${_inspect(value())}`)

  function concat(m) {
    if(!isSameType(Assign, m)) {
      throw new TypeError('Assign.concat: Assign required')
    }

    return Assign(Object.assign({}, x, m.value()))
  }

  return { inspect, value, type, concat, empty }
}

Assign.empty =
  _empty

Assign.type =
  _type

module.exports = Assign
