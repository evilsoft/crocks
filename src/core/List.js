/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const VERSION = 3

const _equals = require('./equals')
const _implements = require('./implements')
const _inspect = require('./inspect')
const type = require('./types').type('List')
const _type = require('./types').typeFn(type(), VERSION)
const fl = require('./flNames')

const array = require('./array')

const apOrFunc = require('./apOrFunc')
const isApplicative = require('./isApplicative')
const isApply = require('./isApply')
const isArray = require('./isArray')
const isEmpty = require('./isEmpty')
const isFunction = require('./isFunction')
const isPredOrFunc = require('./isPredOrFunc')
const isSameType = require('./isSameType')
const isSemigroup = require('./isSemigroup')
const predOrFunc = require('./predOrFunc')

const not =
  fn => x => !fn(x)

const _prepend =
  x => m => x.concat(m)

const { Nothing, Just } = require('./Maybe')

const _of =
  x => List([ x ])

const _empty =
  () => List([])

function fromArray(xs) {
  if(!isArray(xs)) {
    throw new TypeError('List.fromArray: Array required')
  }
  return xs.reduce((res, x) => res.concat(List.of(x)), List.empty())
}

function applyTraverse(x, y) {
  if(isArray(x)) {
    return array.ap(x, array.map(v => _prepend(List.of(v)), y))
  }

  return y
    .map(v => _prepend(List.of(v)))
    .ap(x)
}

function runSequence(acc, x) {
  if(!((isApply(acc) || isArray(acc)) && isSameType(acc, x))) {
    throw new TypeError(
      'List.sequence: Must wrap Applys of the same type'
    )
  }

  return applyTraverse(acc, x)
}

function runTraverse(f) {
  return function(acc, x) {
    const m = f(x)

    if(!((isApply(acc) || isArray(acc)) && isSameType(acc, m))) {
      throw new TypeError('List.traverse: Both functions must return an Apply of the same type')
    }

    return applyTraverse(acc, m)
  }
}

function List(x) {
  if(!arguments.length) {
    throw new TypeError('List: List must wrap something')
  }

  const xs =
    isArray(x) ? x.slice() : [ x ]

  function flatMap(method, fn) {
    return function(y, x) {
      const m = fn(x)

      if(!isSameType(List, m)) {
        throw new TypeError(`List.${method}: Function must return a List`)
      }

      return y.concat(m.valueOf())
    }
  }

  const of =
    _of

  const valueOf =
    () => xs.slice()

  const toArray =
    valueOf

  const empty =
    _empty

  const inspect =
    () => `List${_inspect(xs)}`

  const head =
    () => xs.length
      ? Just(xs[0])
      : Nothing()

  const tail =
    () => xs.length && xs.length > 1
      ? Just(List(xs.slice(1)))
      : Nothing()

  const cons =
    x => List([ x ].concat(xs))

  const equals = m =>
    isSameType(List, m)
      && _equals(xs, m.valueOf())

  function concat(method) {
    return function(m) {
      if(!isSameType(List, m)) {
        throw new TypeError(`List.${method}: List required`)
      }

      return List(xs.concat(m.valueOf()))
    }
  }

  function reduce(method) {
    return function(fn, i) {
      if(!isFunction(fn)) {
        throw new TypeError(`List.${method}: Function required for first argument`)
      }

      return xs.reduce(fn, i)
    }
  }

  function reduceRight(fn, i) {
    if(!isFunction(fn)) {
      throw new TypeError('List.reduceRight: Function required for first argument')
    }

    return xs.reduceRight(fn, i)
  }

  function fold() {
    if(isEmpty(xs)) {
      throw new TypeError('List.fold: List must contain at least one Semigroup')
    }

    const head =
      xs[0]

    if(!isSemigroup(head)) {
      throw new TypeError('List.fold: List must contain Semigroups of the same type')
    }

    return xs.reduce(function(x, y) {
      if(!isSameType(x, y)) {
        throw new TypeError('List.fold: List must contain Semigroups of the same type')
      }

      return x.concat(y)
    })
  }

  function foldMap(fn) {
    if(!isFunction(fn)) {
      throw new TypeError(
        'List.foldMap: Semigroup returning function required'
      )
    }

    if(isEmpty(xs)) {
      throw new TypeError(
        'List.foldMap: List must not be empty'
      )
    }

    const head =
      fn(xs[0])

    if(!isSemigroup(head)) {
      throw new TypeError(
        'List.foldMap: Provided function must return Semigroups of the same type'
      )
    }

    return xs.length !== 1
      ? xs.slice(1).reduce(function(semi, x) {
        const val = fn(x)

        if(!(isSameType(semi, val) && isSemigroup(val))) {
          throw new TypeError(
            'List.foldMap: Provided function must return Semigroups of the same type'
          )
        }
        return semi.concat(val)
      }, head) : head
  }

  function filter(pred) {
    if(!isPredOrFunc(pred)) {
      throw new TypeError('List.filter: Pred or predicate function required')
    }

    return List(
      xs.reduce(
        (x, y) => predOrFunc(pred, y) ? x.concat([ y ]) : x,
        []
      )
    )
  }

  function reject(pred) {
    if(!isPredOrFunc(pred)) {
      throw new TypeError('List.reject: Pred or predicate function required')
    }

    const fn = not(x => predOrFunc(pred, x))

    return List(
      xs.reduce(
        (x, y) => fn(y) ? x.concat([ y ]) : x,
        []
      )
    )
  }

  function map(method) {
    return function(fn) {
      if(!isFunction(fn)) {
        throw new TypeError(`List.${method}: Function required`)
      }

      return List(xs.map(x => fn(x)))
    }
  }

  function ap(m) {
    if(!isSameType(List, m)) {
      throw new TypeError('List.ap: List required')
    }

    const ar = m.valueOf()

    return List(
      xs.reduce((acc, fn) => {
        if(!isFunction(fn)) {
          throw new TypeError('List.ap: Wrapped values must all be functions')
        }

        return acc.concat(ar.map(x => fn(x)))
      }, [])
    )
  }

  function chain(method) {
    return function(fn) {
      if(!isFunction(fn)) {
        throw new TypeError(`List.${method}: Function required`)
      }

      return List(xs.reduce(flatMap(method, fn), []))
    }
  }

  function sequence(f) {
    if(!(isApplicative(f) || isFunction(f))) {
      throw new TypeError(
        'List.sequence: Applicative TypeRep or Apply returning function required'
      )
    }

    const af =
      apOrFunc(f)

    return reduceRight(
      runSequence,
      af(List.empty())
    )
  }

  function traverse(f, fn) {
    if(!(isApplicative(f) || isFunction(f))) {
      throw new TypeError(
        'List.traverse: Applicative TypeRep or Apply returning function required for first argument'
      )
    }

    if(!isFunction(fn)) {
      throw new TypeError(
        'List.traverse: Apply returning functions required for second argument'
      )
    }

    const af =
      apOrFunc(f)

    return reduceRight(
      runTraverse(fn),
      af(List.empty())
    )
  }

  return {
    inspect, toString: inspect, valueOf, toArray,
    head, tail, cons, type, equals, empty,
    reduceRight, fold, foldMap, filter, reject,
    ap, of, sequence, traverse,
    concat: concat('concat'),
    map: map('map'),
    chain: chain('chain'),
    reduce: reduce('reduce'),
    [fl.of]: of,
    [fl.equals]: equals,
    [fl.concat]: concat(fl.concat),
    [fl.empty]: empty,
    [fl.map]: map(fl.map),
    [fl.chain]: chain(fl.chain),
    [fl.reduce]: reduce(fl.reduce),
    ['@@type']: _type,
    constructor: List
  }
}

List.of = _of
List.empty = _empty
List.type = type

List[fl.of] = _of
List[fl.empty] = _empty
List['@@type'] = _type

List.fromArray =
  fromArray

List['@@implements'] = _implements(
  [ 'ap', 'chain', 'concat', 'empty', 'equals', 'map', 'of', 'reduce', 'traverse' ]
)

module.exports = List
