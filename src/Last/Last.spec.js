const test = require('tape')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const Maybe = require('../core/Maybe')
const isFunction = require('../core/isFunction')
const isObject = require('../core/isObject')
const isSameType = require('../core/isSameType')
const isString = require('../core/isString')

const constant = x => () => x
const extract = m => m.option('empty')

const Last = require('.')

test('Last', t => {
  t.ok(isFunction(Last), 'is a function')
  t.ok(isObject(Last(0)), 'returns an object')

  t.equals(Last(0).constructor, Last, 'provides TypeRep on constructor')

  t.ok(isFunction(Last.empty), 'provides an empty function')
  t.ok(isFunction(Last.type), 'provides a type function')
  t.ok(isString(Last['@@type']), 'provides a @@type string')

  const err = /Last: Requires one argument/
  t.throws(Last, err, 'throws when passed nothing')

  t.end()
})

test('Last fantasy-land api', t => {
  const m = Last(false)

  t.equals(Last['fantasy-land/empty'], Last.empty, 'is same function as public constructor empty')

  t.equals(m['fantasy-land/empty'], m.empty, 'is same function as public instance empty')
  t.equals(m['fantasy-land/concat'], m.concat, 'is same function as public instance concat')

  t.end()
})

test('Last @@implements', t => {
  const f = Last['@@implements']

  t.equal(f('concat'), true, 'implements concat func')
  t.equal(f('empty'), true, 'implements empty func')

  t.end()
})

test('Last inspect', t => {
  const val = Last(0)
  const just = Last(Maybe.Just(1))
  const nothing = Last(Maybe.Nothing())

  t.ok(isFunction(val.inspect), 'provides an inspect function')
  t.equal(val.inspect, val.toString, 'toString is the same function as inspect')

  t.equal(val.inspect(), 'Last( Just 0 )', 'returns inspect string for value construction')
  t.equal(just.inspect(), 'Last( Just 1 )', 'returns inspect string for value construction')
  t.equal(nothing.inspect(), 'Last( Nothing )', 'returns inspect string for value construction')

  t.end()
})

test('Last valueOf', t => {
  t.ok(isFunction(Last(0).valueOf), 'is a function')

  const val = Last(1).valueOf()
  const just = Last(Maybe.Just(2)).valueOf()
  const nothing = Last(Maybe.Nothing()).valueOf()

  t.ok(isSameType(Maybe, val), 'returns a Maybe when constructed with a value')
  t.ok(isSameType(Maybe, just), 'returns a Maybe when constructed with a Just')
  t.ok(isSameType(Maybe, nothing), 'returns a Maybe when constructed with a nothing')

  t.equal(extract(val), 1, 'returns a Just when constructed with a value')
  t.equal(extract(just), 2, 'returns a Just when constructed with a Just')
  t.equal(extract(nothing), 'empty', 'returns a Nothing when constructed with a Nothing')

  t.end()
})

test('Last type', t => {
  const m = Last(0)

  t.ok(isFunction(m.type), 'is a function')
  t.equal(Last.type, m.type, 'static and instance versions are the same')
  t.equal(m.type(), 'Last', 'reports Last')

  t.end()
})

test('Last @@type', t => {
  const m = Last(0)

  t.equal(Last['@@type'], m['@@type'], 'static and instance versions are the same')
  t.equal(m['@@type'], 'crocks/Last@1', 'reports crocks/Last@1')

  t.end()
})

test('Last option', t => {
  const val = Last('val')
  const just = Last('just')
  const nothing = Last('nothing')

  t.equal(val.option('nothing'), 'val', 'extracts the underlying Just value')
  t.equal(just.option('nothing'), 'just', 'extracts the underlying Just value')
  t.equal(nothing.option('nothing'), 'nothing', 'returns the provided value with underlying Nothing')

  t.end()
})

test('Last concat functionality', t => {
  const a = Last('a')
  const b = Last('b')

  const notLast = { type: constant('Last...Not') }

  const cat = bindFunc(a.concat)

  const err = /Last.concat: Last required/
  t.throws(cat(undefined), err, 'throws with undefined')
  t.throws(cat(null), err, 'throws with null')
  t.throws(cat(0), err, 'throws with falsey number')
  t.throws(cat(1), err, 'throws with truthy number')
  t.throws(cat(''), err, 'throws with falsey string')
  t.throws(cat('string'), err, 'throws with truthy string')
  t.throws(cat(false), err, 'throws with false')
  t.throws(cat(true), err, 'throws with true')
  t.throws(cat([]), err, 'throws with an array')
  t.throws(cat({}), err, 'throws with an object')
  t.throws(cat(notLast), err, 'throws when passed non-Last')

  t.equal(extract(a.concat(b)), 'b', 'returns the last value concatted')

  t.end()
})

test('Last concat properties (Semigroup)', t => {
  const a = Last(0)
  const b = Last(1)
  const c = Last('')

  const left = a.concat(b).concat(c)
  const right = a.concat(b.concat(c))

  t.ok(isFunction(a.concat), 'provides a concat function')
  t.equal(extract(left), extract(right), 'associativity')
  t.equal(a.concat(b).type(), a.type(), 'returns an Last')

  t.end()
})

test('Last empty functionality', t => {
  const x = Last.empty()

  t.equal(x.type(), 'Last', 'provides an Last')
  t.equal(extract(x), 'empty', 'provides a true value')

  t.end()
})

test('Last empty properties (Monoid)', t => {
  const m = Last(3)

  t.ok(isFunction(m.concat), 'provides a concat function')
  t.ok(isFunction(m.empty), 'provides an empty function')

  const right = m.concat(m.empty())
  const left = m.empty().concat(m)

  t.equal(extract(right), extract(m), 'right identity')
  t.equal(extract(left), extract(m), 'left identity')

  t.end()
})
