/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isFunction = require('../internal/isFunction')
const isApplicative = require('../internal/isApplicative')
const isType = require('../internal/isType')

const constant = require('../combinators/constant')
const composeB = require('../combinators/composeB')

const _inspect = require('../funcs/inspect')

const isEqual =
  x => y => x === y

Either.Left =
  l => Either(l, null)

Either.Right =
  r => Either(null, r)

const _of =
  Either.Right

const _type =
  constant('Either')

const isLeft =
  l => l !== null

function runSequence(x) {
  if(!isApplicative(x)) {
    throw new TypeError('Either.sequence: Must wrap an Applicative')
  }

  return x.map(Either.of)
}

function Either(l, r) {
  if(arguments.length < 2) {
    throw new TypeError('Either: Requires two arguments')
  }
  else if(l === null && r === null) {
    throw new TypeError('Either: Requires at least one of its arguments to be non-null')
  }

  const type =
    _type

  const value =
    () => isLeft(l) ? l : r

  const equals =
    m => isType(type(), m) && m.either(isEqual(l), isEqual(r))

  const of =
    _of

  const inspect = constant(
    either(
      constant(`Either.Left${_inspect(l)}`),
      constant(`Either.Right${_inspect(r)}`)
    )
  )

  function either(f, g) {
    if(!isFunction(f) || !isFunction(g)) {
      throw new TypeError('Either.either: Requires both left and right functions')
    }

    return isLeft(l) ? f(l) : g(r)
  }

  function swap(f, g) {
    if(!isFunction(f) || !isFunction(g)) {
      throw new TypeError('Either.swap: Requires both left and right functions')
    }

    return either(
      composeB(Either.Right, f),
      composeB(Either.Left, g)
    )
  }

  function coalesce(f, g) {
    if(!isFunction(f) || !isFunction(g)) {
      throw new TypeError('Either.coalesce: Requires both left and right functions')
    }

    return Either.Right(either(f, g))
  }

  function map(fn) {
    if(!isFunction(fn)) {
      throw new TypeError('Either.map: function required')
    }

    return either(Either.Left, composeB(Either.Right, fn))
  }

  function bimap(f, g) {
    if(!isFunction(f) || !isFunction(g)) {
      throw new TypeError('Either.bimap: Requires both left and right functions')
    }

    return either(
      composeB(Either.Left, f),
      composeB(Either.Right, g)
    )
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

    const m = either(Either.Left, fn)

    if(!(m && isType(type(), m))) {
      throw new TypeError('Either.chain: function must return an Either')
    }

    return m
  }

  function sequence(af) {
    if(!isFunction(af)) {
      throw new TypeError('Either.sequence: Applicative Function required')
    }

    return either(
      composeB(af, Either.Left),
      runSequence
    )
  }

  function traverse(f, af) {
    if(!isFunction(f) || !isFunction(af)) {
      throw new TypeError('Either.traverse: Applicative returning functions required for both arguments')
    }

    const m = either(composeB(af, Either.Left), f)

    if(!isApplicative(m)) {
      throw new TypeError('Either.traverse: Both functions must return an Applicative')
    }

    return either(
      constant(m),
      constant(m.map(Either.of))
    )
  }

  return {
    inspect, either, value, type,
    swap, coalesce, equals, map, bimap,
    ap, of, chain, sequence, traverse
  }
}

Either.of   = _of
Either.type = _type

module.exports = Either
