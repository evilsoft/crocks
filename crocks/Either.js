/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isFunction  = require('../internal/isFunction')
const isType      = require('../internal/isType')
const constant    = require('../combinators/constant')
const composeB    = require('../combinators/composeB')
const _inspect    = require('../funcs/inspect')

const isEqual = x => y => x === y

Either.Left   = l => Either(l, null)
Either.Right  = r => Either(null, r)

const _of   = Either.Right
const _type = constant('Either')

const isLeft = l => l !== null

function Either(l, r) {
  if(arguments.length < 2) {
    throw new TypeError('Either: Requires two arguments')
  }
  else if(l === null && r === null) {
    throw new TypeError('Either: Requires at least one of its arguments to be non-null')
  }

  const type    = _type
  const value   = () => isLeft(l) ? l : r
  const equals  = m => isType(type(), m) && m.either(isEqual(l), isEqual(r))
  const of      = _of

  const inspect = constant(
    either(
      constant(`Either.Left${_inspect(l)}`),
      constant(`Either.Right${_inspect(r)}`)
    )
  )

  function either(lf, rf) {
    if(!isFunction(lf) || !isFunction(rf)) {
      throw new TypeError('Either.either: Requires both left and right functions')
    }

    return isLeft(l) ? lf(l) : rf(r)
  }

  function map(fn) {
    if(!isFunction(fn)) {
      throw new TypeError('Either.map: function required')
    }

    return either(Either.Left, composeB(Either.Right, fn))
  }

  function ap(m) {
    if(!either(constant(true), isFunction)) {
      throw new TypeError('Either.ap: Wrapped value must be a function')
    }
    else if(!either(constant(true), constant(isType(type(), m)))) {
      throw new TypeError('Either.ap: Either required')
    }

    return chain(fn => m.map(fn))
  }

  function chain(fn) {
    if(!isFunction(fn)) {
      throw new TypeError('Either.chain: function required')
    }

    return either(Either.Left, fn)
  }

  return {
    inspect, either, value, type,
    equals, map, ap, of, chain
  }
}

Either.of   = _of
Either.type = _type

module.exports = Either
