/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isFunction = require('../internal/isFunction')
const isType = require('../internal/isType')

const _inspect = require('../internal/inspect')

const constant = require('../combinators/constant')

const _type =
  constant('Const')

function Const(x) {
  if(!arguments.length) {
    throw new TypeError('Const: Must wrap something')
  }

  const equals =
    m => isType(type(), m) && x === m.value()

  const inspect =
    constant(`Const${_inspect(x)}`)

  const value =
    constant(x)

  const type =
    _type

  function concat(m) {
    if(!(m && isType(type(), m))) {
      throw new TypeError('Const.concat: Const required')
    }

    return Const(x)
  }

  function map(fn) {
    if(!isFunction(fn)) {
      throw new TypeError('Const.map: Function required')
    }

    return Const(x)
  }

  function ap(m) {
    if(!isType(type(), m)) {
      throw new TypeError('Const.ap: Const required')
    }

    return Const(x)
  }

  function chain(fn) {
    if(!isFunction(fn)) {
      throw new TypeError('Const.chain: Function required')
    }

    return Const(x)
  }

  return {
    inspect, value, type, equals,
    concat, map, ap, chain
  }
}

Const.type =
  _type

module.exports = Const
