const test = require('tape')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const composeB = require('../combinators/composeB')
const constant = require('../combinators/constant')
const identity = require('../combinators/identity')

const array = require('./array')

const map = array.map
const ap = array.ap
const chain = array.chain

test('array map properties (Functor)', t => {
  const m = [ 49 ]

  const f = x => x + 54
  const g = x => x * 4

  t.same(map(identity, m), m, 'identity')
  t.same(map(composeB(f, g), m), map(f, map(g, m)), 'composition')

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

  const a = x => ap(x, ap(m, map(composeB, m)))
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
