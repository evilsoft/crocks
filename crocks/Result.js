/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const and = require('../logic/and')
const ifElse = require('../logic/ifElse')
const isApplicative = require('../predicates/isApplicative')
const isFunction = require('../predicates/isFunction')
const isSameType = require('../predicates/isSameType')
const isSemigroup = require('../predicates/isSemigroup')

const _inspect = require('../internal/inspect')
const defineUnion = require('../internal/defineUnion')
const innerConcat = require('../internal/innerConcat')

const composeB = require('../combinators/composeB')
const constant = require('../combinators/constant')
const identity = require('../combinators/identity')

const _result =
  defineUnion({ Err: [ 'a' ], Ok: [ 'b' ] })

Result.Err =
  composeB(Result, _result.Err)

Result.Ok =
  composeB(Result, _result.Ok)

const _of =
  Result.Ok

const _type =
  constant('Result')

const concatErr =
  m => x => m.either(
    y => and(isSemigroup, isSameType(y), x) ? x.concat(y) : x,
    () => x
  )

function runSequence(x) {
  if(!isApplicative(x)) {
    throw new TypeError('Result.sequence: Must wrap an Applicative')
  }

  return x.map(Result.of)
}

function Result(u) {
  if(!arguments.length) {
    throw new TypeError('Result: Must wrap something, try using Err or Ok constructors')
  }

  const x =
    ifElse(_result.includes, identity, _result.Ok, u)

  const type =
    _type

  const equals =
    m => isSameType(Result, m) && either(
      x => m.either(y => y === x, constant(false)),
      x => m.either(constant(false), y => y === x)
    )

  const of =
    _of

  const inspect = constant(
    either(
      l => `Result.Err${_inspect(l)}`,
      r => `Result.Ok${_inspect(r)}`
    )
  )

  function either(f, g) {
    if(!isFunction(f) || !isFunction(g)) {
      throw new TypeError('Result.either: Requires both invalid and valid functions')
    }

    return _result.caseOf({
      Err: f,
      Ok: g
    }, x)
  }

  function concat(m) {
    if(!isSameType(Result, m)) {
      throw new TypeError('Result.concat: Result of Semigroup required')
    }

    return either(
      Result.Err,
      innerConcat(Result, m)
    )
  }

  function swap(f, g) {
    if(!isFunction(f) || !isFunction(g)) {
      throw new TypeError('Result.swap: Requires both left and right functions')
    }

    return either(
      composeB(Result.Ok, f),
      composeB(Result.Err, g)
    )
  }

  function coalesce(f, g) {
    if(!isFunction(f) || !isFunction(g)) {
      throw new TypeError('Result.coalesce: Requires both left and right functions')
    }

    return Result.Ok(either(f, g))
  }

  function map(fn) {
    if(!isFunction(fn)) {
      throw new TypeError('Result.map: function required')
    }

    return either(
      Result.Err,
      composeB(Result.Ok, fn)
    )
  }

  function bimap(f, g) {
    if(!isFunction(f) || !isFunction(g)) {
      throw new TypeError('Result.bimap: Requires both left and right functions')
    }

    return either(
      composeB(Result.Err, f),
      composeB(Result.Ok, g)
    )
  }

  function alt(m) {
    if(!isSameType(Result, m)) {
      throw new TypeError('Result.alt: Result required')
    }

    return either(
      constant(m),
      Result.Ok
    )
  }

  function ap(m) {
    if(!isSameType(Result, m)) {
      throw new TypeError('Result.ap: Result required')
    }

    return either(
      composeB(Result.Err, concatErr(m)),
      function(fn) {
        if(!isFunction(fn)) {
          throw new TypeError('Result.ap: Wrapped value must be a function')
        }

        return m.either(Result.Err, () => m.map(fn))
      }
    )
  }

  function chain(fn) {
    if(!isFunction(fn)) {
      throw new TypeError('Result.chain: Result returning function required')
    }

    const m = either(Result.Err, fn)

    if(!isSameType(Result, m)) {
      throw new TypeError('Result.chain: Function must return a Result')
    }

    return m
  }

  function sequence(af) {
    if(!isFunction(af)) {
      throw new TypeError('Result.sequence: Applicative returning function required')
    }

    return either(
      composeB(af, Result.Err),
      runSequence
    )
  }
  function traverse(af, f) {
    if(!isFunction(f) || !isFunction(af)) {
      throw new TypeError('Result.traverse: Applicative returning functions required for both arguments')
    }

    const m = either(composeB(af, Result.Err), f)

    if(!isApplicative(m)) {
      throw new TypeError('Result.traverse: Both functions must return an Applicative')
    }

    return either(
      constant(m),
      constant(m.map(Result.Ok))
    )
  }

  return {
    inspect, equals, type, either, concat,
    swap, coalesce, map, bimap, alt, ap,
    chain, of, sequence, traverse
  }
}

Result.of =
  _of

Result.type =
  _type

module.exports = Result
