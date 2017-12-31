const test = require('tape')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const isFunction = require('../core/isFunction')
const isObject = require('../core/isObject')
const isSameType = require('../core/isSameType')

const Maybe = require('../core/Maybe')
const First = require('.')

const constant = x => () => x

const extract =
  m => m.option('empty')

test('First', t => {
  t.ok(isFunction(First), 'is a function')
  t.ok(isObject(First(0)), 'returns an object')

  t.equals(First(0).constructor, First, 'provides TypeRep on constructor')

  t.ok(isFunction(First.empty), 'provides an empty function')
  t.ok(isFunction(First.type), 'provides a type function')

  const err = /First: Requires one argument/
  t.throws(First, err, 'throws when passed nothing')

  t.end()
})

test('First @@implements', t => {
  const f = First['@@implements']

  t.equal(f('concat'), true, 'implements concat func')
  t.equal(f('empty'), true, 'implements empty func')

  t.end()
})

test('First inspect', t => {
  const val = First(0)
  const just = First(Maybe.Just(1))
  const nothing = First(Maybe.Nothing())

  t.ok(isFunction(val.inspect), 'provides an inspect function')
  t.equal(val.inspect(), 'First( Just 0 )', 'returns inspect string for value construction')
  t.equal(just.inspect(), 'First( Just 1 )', 'returns inspect string for value construction')
  t.equal(nothing.inspect(), 'First( Nothing )', 'returns inspect string for value construction')

  t.end()
})

test('First valueOf', t => {
  t.ok(isFunction(First(0).valueOf), 'is a function')

  const val = First(1).valueOf()
  const just = First(Maybe.Just(2)).valueOf()
  const nothing = First(Maybe.Nothing()).valueOf()

  t.ok(isSameType(Maybe, val), 'returns a Maybe when constructed with a value')
  t.ok(isSameType(Maybe, just), 'returns a Maybe when constructed with a Just')
  t.ok(isSameType(Maybe, nothing), 'returns a Maybe when constructed with a nothing')

  t.equal(extract(val), 1, 'returns a Just when constructed with a value')
  t.equal(extract(just), 2, 'returns a Just when constructed with a Just')
  t.equal(extract(nothing), 'empty', 'returns a Nothing when constructed with a Nothing')

  t.end()
})

test('First type', t => {
  t.ok(isFunction(First(0).type), 'is a function')
  t.equal(First.type, First(0).type, 'is the same function as the static type')
  t.equal(First(0).type(), 'First', 'reports First')

  t.end()
})

test('First option', t => {
  const val = First('val')
  const just = First('just')
  const nothing = First('nothing')

  t.equal(val.option('nothing'), 'val', 'extracts the underlying Just value')
  t.equal(just.option('nothing'), 'just', 'extracts the underlying Just value')
  t.equal(nothing.option('nothing'), 'nothing', 'returns the provided value with underlying Nothing')

  t.end()
})

test('First concat functionality', t => {
  const a = First('a')
  const b = First('b')

  const notFirst = { type: constant('First...Not') }

  const cat = bindFunc(a.concat)

  const err = /First.concat: First required/
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
  t.throws(cat(notFirst), err, 'throws when passed non-First')

  t.equal(extract(a.concat(b)), 'a', 'returns the first value concatted')

  t.end()
})

test('First concat properties (Semigroup)', t => {
  const a = First(0)
  const b = First(1)
  const c = First('')

  const left = a.concat(b).concat(c)
  const right = a.concat(b.concat(c))

  t.ok(isFunction(a.concat), 'provides a concat function')
  t.equal(extract(left), extract(right), 'associativity')
  t.equal(a.concat(b).type(), a.type(), 'returns an First')

  t.end()
})

test('First empty functionality', t => {
  const x = First.empty()

  t.equal(x.type(), 'First', 'provides an First')
  t.equal(extract(x), 'empty', 'provides a true value')

  t.end()
})

test('First empty properties (Monoid)', t => {
  const m = First(3)

  t.ok(isFunction(m.concat), 'provides a concat function')
  t.ok(isFunction(m.empty), 'provides an empty function')

  const right = m.concat(m.empty())
  const left = m.empty().concat(m)

  t.equal(extract(right), extract(m), 'right identity')
  t.equal(extract(left), extract(m), 'left identity')

  t.end()
})
