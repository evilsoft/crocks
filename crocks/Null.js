/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isFunction  = require('../internal/isFunction')
const isType      = require('../internal/isType')

const _inspect = require('../funcs/inspect')

const constant = require('../combinators/constant')

const _type   = constant('Null')
const _of     = Null
const _empty  = Null

function Null() {
  const x = null

  const equals = m => isType(type(), m) && x === m.value()
  const inspect = constant(`Null`)

  const value = constant(x)
  const type  = _type
  const of    = _of
  const empty = _empty

  function concat(m) {
    if(!(m && isType(type(), m))) {
      throw new TypeError('Null.concat: Null required')
    }

    return Null()
  }

  function map(fn) {
    if(!isFunction(fn)) {
      throw new TypeError('Const.map: Function required')
    }

    return Null(fn(x))
  }

  function ap(m) {
    if(!isType(type(), m)) {
      throw new TypeError('Null.ap: Null required')
    }

    return Null()
  }

  function chain(fn) {
    if(!isFunction(fn)) {
      throw new TypeError('Null.chain: Function required')
    }

    const m = fn(x)

    if(!(m && isType(type(), m))) {
      throw new TypeError('Null.chain: function must return a Null')
    }

    return Null()
  }

  return {
    inspect, value, type, equals,
    concat, empty, map, ap, of, chain
  }
}

Null.type   = _type
Null.of     = _of
Null.empty  = _empty

module.exports = Null


