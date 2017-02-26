/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isFunction = require('../predicates/isFunction')
const isSemigroup = require('../predicates/isSemigroup')

const _inspect = require('../internal/inspect')
const isSameType = require('../predicates/isSameType')

const constant = require('../combinators/constant')

const _type =
  constant('Pair')

function Pair(l, r) {
  if(arguments.length < 2) {
    throw new TypeError('Pair: Must provide a first and second value')
  }

  const type =
    _type

  const fst =
    constant(l)

  const snd =
    constant(r)

  const inspect =
    () => `Pair${_inspect(l)}${_inspect(r)}`

  function merge(fn) {
    if(!isFunction(fn)) {
      throw new TypeError('Pair.merge: Binary function required')
    }

    return fn(fst(), snd())
  }

  function equals(m) {
    return isSameType(Pair, m)
      && m.fst() === fst()
      && m.snd() === snd()
  }

  function concat(m) {
    if(!(m && isSameType(Pair, m))) {
      throw new TypeError('Pair.concat: Pair required')
    }
    else if(!isSemigroup(fst()) || !isSemigroup(snd())) {
      throw new TypeError('Pair.concat: Source Pair must contain Semigroups')
    }
    else if(!isSemigroup(m.fst()) || !isSemigroup(m.snd())) {
      throw new TypeError('Pair.concat: Provided Pair must contain Semigroups')
    }

    return Pair(
      fst().concat(m.fst()),
      snd().concat(m.snd())
    )
  }

  function swap(f, g) {
    if(!isFunction(f) || !isFunction(g)) {
      throw new TypeError('Pair.swap: Requires both left and right functions')
    }

    return Pair(g(r), f(l))
  }

  function map(fn) {
    if(!isFunction(fn)) {
      throw new TypeError('Pair.map: Function required')
    }

    return Pair(l, fn(r))
  }

  function bimap(f, g) {
    if(!isFunction(f) || !isFunction(g)) {
      throw new TypeError('Pair.bimap: Function required for both arguments')
    }

    return Pair(f(l), g(r))
  }

  function ap(m) {
    if(!isFunction(snd())) {
      throw new TypeError('Pair.ap: Function required for second value')
    }
    else if(!isSemigroup(fst())) {
      throw new TypeError('Pair.ap: Semigroup required for first value')
    }
    else if(!(isSameType(Pair, m))) {
      throw new TypeError('Pair.ap: Pair required')
    }
    else if(!isSemigroup(m.fst())) {
      throw new TypeError('Pair.ap: Semigroup required for first value')
    }

    return chain(fn => m.map(fn))
  }

  function chain(fn) {
    if(!isSemigroup(fst())) {
      throw new TypeError('Pair.chain: Semigroup required for first value')
    }
    else if(!isFunction(fn)) {
      throw new TypeError('Pair.chain: Function required')
    }

    const m = fn(snd())

    if(!(isSameType(Pair, m))) {
      throw new TypeError('Pair.chain: Function must return a Pair')
    }
    else if(!isSemigroup(m.fst())) {
      throw new TypeError('Pair.chain: Semigroup required for first value of chained function result')
    }

    return Pair(
      fst().concat(m.fst()),
      m.snd()
    )
  }

  return {
    inspect, fst, snd, type,
    merge, equals, concat, swap,
    map, bimap, ap, chain
  }
}

Pair.type =
  _type

module.exports = Pair
