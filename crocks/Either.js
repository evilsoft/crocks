/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const ifElse = require('../logic/ifElse')
const isApplicative = require('../predicates/isApplicative')
const isFunction = require('../predicates/isFunction')
const isSameType = require('../predicates/isSameType')

const _inspect = require('../internal/inspect')
const defineUnion = require('../internal/defineUnion')
const innerConcat = require('../internal/innerConcat')

const constant = require('../combinators/constant')
const composeB = require('../combinators/composeB')
const identity = require('../combinators/identity')

const _either = defineUnion({ Left: [ 'a' ], Right: [ 'b' ] })

const Left = _either.Left
const Right = _either.Right

Either.Left =
  composeB(Either, Left)

Either.Right =
  composeB(Either, Right)

const _of =
  Either.Right

const _type =
  constant('Either')

function runSequence(x) {
  if(!isApplicative(x)) {
    throw new TypeError('Either.sequence: Must wrap an Applicative')
  }

  return x.map(Either.of)
}

function Either(u) {
  if(!arguments.length) {
    throw new TypeError('Either: Must wrap something, try using Left or Right constructors')
  }

  const x = ifElse(_either.includes, identity, Right, u)

  const type =
    _type

  const equals =
    m => isSameType(Either, m) && either(
      x => m.either(y => y === x, constant(false)),
      x => m.either(constant(false), y => y === x)
    )

  const of =
    _of

  const inspect = constant(
    either(
       l => `Either.Left${_inspect(l)}`,
       r => `Either.Right${_inspect(r)}`
    )
  )

  function either(f, g) {
    if(!isFunction(f) || !isFunction(g)) {
      throw new TypeError('Either.either: Requires both left and right functions')
    }

    return _either.caseOf({
      Left: f,
      Right: g
    }, x)
  }

  function concat(m) {
    if(!isSameType(Either, m)) {
      throw new TypeError('Either.concat: Either of Semigroup required')
    }

    return either(
      Either.Left,
      innerConcat(Either, m)
    )
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
      throw new TypeError('Either.map: Function required')
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

  function alt(m) {
    if(!isSameType(Either, m)) {
      throw new TypeError('Either.alt: Either required')
    }

    return either(
      constant(m),
      Either.Right
    )
  }

  function ap(m) {
    if(!either(constant(true), isFunction)) {
      throw new TypeError('Either.ap: Wrapped value must be a function')
    }
    else if(!either(constant(true), constant(isSameType(Either, m)))) {
      throw new TypeError('Either.ap: Either required')
    }

    return chain(fn => m.map(fn))
  }

  function chain(fn) {
    if(!isFunction(fn)) {
      throw new TypeError('Either.chain: Function required')
    }

    const m = either(Either.Left, fn)

    if(!isSameType(Either, m)) {
      throw new TypeError('Either.chain: Function must return an Either')
    }

    return m
  }

  function sequence(af) {
    if(!isFunction(af)) {
      throw new TypeError('Either.sequence: Applicative returning function required')
    }

    return either(
      composeB(af, Either.Left),
      runSequence
    )
  }

  function traverse(af, f) {
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
    inspect, either, type, concat,
    swap, coalesce, equals, map, bimap,
    alt, ap, of, chain, sequence, traverse
  }
}

Either.of   = _of
Either.type = _type

module.exports = Either
