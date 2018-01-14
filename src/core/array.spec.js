const test = require('tape')
const helpers = require('../test/helpers')
const MockCrock = require('../test/MockCrock')

const bindFunc = helpers.bindFunc

const curry = require('./curry')
const compose = curry(require('./compose'))
const isSameType = require('./isSameType')

const array = require('./array')

const map = array.map
const ap = array.ap
const chain = array.chain
const sequence = array.sequence
const traverse = array.traverse

const constant = x => () => x
const identity = x => x

test('array map properties (Functor)', t => {
  const m = [ 49 ]

  const f = x => x + 54
  const g = x => x * 4

  t.same(map(identity, m), m, 'identity')
  t.same(map(compose(f, g), m), map(f, map(g, m)), 'composition')

  t.end()
})

test('array map functionality', t => {
  const m = [ 97, 45 ]
  const f = x => x * 10

  t.same(map(f, m), [ 970, 450 ], 'applies function to each element in the array')
  t.same(map(f, []), [], 'returns an empty array if array is empty')

  const binary = (fst, snd) => ({ fst, snd })

  const result = map(binary, [ 1 ])[0]
  t.equals(result.snd, undefined, 'does not apply anything to second arg of function')

  t.end()
})

test('array ap errors', t => {
  const x = [ 1, 2 ]
  const f = bindFunc(m => ap(x, m))

  const noFunc = /Array.ap: Second Array must all be functions/
  t.throws(f([ undefined ]), noFunc, 'throws when second array contains undefined')
  t.throws(f([ null ]), noFunc, 'throws when second array contains null')
  t.throws(f([ 0 ]), noFunc, 'throws when second array contains falsey number')
  t.throws(f([ 1 ]), noFunc, 'throws when second array contains truthy number')
  t.throws(f([ '' ]), noFunc, 'throws when second array contains falsey string')
  t.throws(f([ 'string' ]), noFunc, 'throws when second array contains truthy string')
  t.throws(f([ false ]), noFunc, 'throws when second array contains false')
  t.throws(f([ true ]), noFunc, 'throws when second array contains true')
  t.throws(f([ {} ]), noFunc, 'throws when second array contains an object')
  t.throws(f([ [] ]), noFunc, 'throws when second array contains an empty array')

  t.end()
})

test('array ap properties (Apply)', t => {
  const m = [ identity ]

  const a = x => ap(x, ap(m, map(compose, m)))
  const b = x => ap(x, ap(m, m))

  t.same(a([ 3 ]), b([ 3 ]), 'composition')

  t.end()
})

test('array ap functionality', t => {
  const f = x => x + 2
  const g = x => x + 1

  const funcs = [ f, g ]
  const values = [ 1 , 2 ]

  const result = ap(values, funcs)

  t.same(result, [ 3, 4, 2, 3 ], 'applies functions to values as expected')
  t.same(ap([], funcs), [], 'returns an empty array if values are empty')
  t.end()
})

test('array chain errors', t => {
  const f = bindFunc(x => chain(constant(x), [ 25 ]))

  const err = /Array.chain: Function must return an Array/
  t.throws(f(undefined), err, 'throws when function returns undefined')
  t.throws(f(null), err, 'throws when function returns null')
  t.throws(f(0), err, 'throws when function returns falsey number')
  t.throws(f(1), err, 'throws when function returns truthy number')
  t.throws(f(''), err, 'throws when function returns falsey string')
  t.throws(f('string'), err, 'throws when function returns truthy string')
  t.throws(f(false), err, 'throws when function returns false')
  t.throws(f(true), err, 'throws when function returns true')
  t.throws(f({}), err, 'throws when function returns false')
  t.throws(f(identity), err, 'throws when function returns a function')

  t.end()
})

test('array chain properties (Chain)', t => {
  const f = x => [ x + 2 ]
  const g = x => [ x * 10 ]

  const a = x => chain(g, chain(f, x))
  const b = x => chain(y => chain(g, f(y)), x)

  t.same(a([ 10 ]), b([ 10 ]), 'assosiativity')

  t.end()
})

test('array chain functionality', t => {
  const f = x => [ x, x + 1 ]

  t.same(chain(f, [ 1, 2 ]), [ 1, 2, 2, 3 ], 'chains as expected with elements')
  t.same(chain(f, []), [], 'chain on empty array, returns an empty array')

  t.end()
})

test('array sequence errors', t => {
  const seq = bindFunc(x => sequence(MockCrock.of, [ x ]))

  const err = /Array.sequence: Must wrap Applicatives/
  t.throws(seq(undefined), err, 'throws with undefined')
  t.throws(seq(null), err, 'throws with null')
  t.throws(seq(0), err, 'throws falsey with number')
  t.throws(seq(1), err, 'throws truthy with number')
  t.throws(seq(''), err, 'throws falsey with string')
  t.throws(seq('string'), err, 'throws with truthy string')
  t.throws(seq(false), err, 'throws with false')
  t.throws(seq(true), err, 'throws with true')
  t.throws(seq([]), err, 'throws with an array')
  t.throws(seq({}), err, 'throws with an object')

  t.doesNotThrow(seq(MockCrock(2)), 'allows an Applicative returning function')

  t.end()
})

test('array sequence functionality', t => {
  const x = 'string'
  const m = sequence(MockCrock.of, [ MockCrock(x) ])

  t.ok(isSameType(MockCrock, m), 'Provides an outer type of MockCrock')
  t.ok(isSameType(Array, m.valueOf()), 'Provides an inner type of array')
  t.same(m.valueOf()[0], x, 'inner List contains original inner value')

  const ar = x => [ x ]
  const arM = sequence(ar, [ [ x ] ])

  t.ok(isSameType(Array, arM), 'Provides an outer type of Array')
  t.ok(isSameType(Array, arM[0]), 'Provides an inner type of Array')
  t.same(arM[0][0], x, 'inner array contains original inner value')

  t.end()
})

test('array traverse errors', t => {
  const trav = bindFunc((af, fn, x) => traverse(af, fn, [ x ]))

  const noAppl = /Array.traverse: Must wrap Applicatives/
  t.throws(trav(constant(undefined), MockCrock, 2), noAppl, 'throws when first function returns non-applicative')
  t.throws(trav(MockCrock, constant([ 99 ]), 2), noAppl, 'throws when second function returns a different type')

  t.doesNotThrow(trav(MockCrock, MockCrock, 2), 'allows Applicative returning functions')

  t.end()
})

test('List traverse functionality', t => {
  const x = 'string'
  const m = traverse(MockCrock.of, MockCrock, [ x ])

  t.ok(isSameType(MockCrock, m), 'Provides an outer type of MockCrock')
  t.ok(isSameType(Array, m.valueOf), 'Provides an inner type of Array')
  t.same(m.valueOf()[0], x, 'inner array contains original inner value')

  const ar = x => [ x ]
  const arM = traverse(ar, ar, [ x ])

  t.ok(isSameType(Array, arM), 'Provides an outer type of Array')
  t.ok(isSameType(Array, arM[0]), 'Provides an inner type of Array')
  t.same(arM[0][0], x, 'inner array contains original inner value')

  t.end()
})
