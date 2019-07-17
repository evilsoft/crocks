const test = require('tape')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const isFunction = require('../core/isFunction')

const psi = require('./psi')

test('psi (P combinator)', t => {
  const fn = bindFunc(psi)
  const f = x => y => x * y
  const g = x => x - 1
  const x = 22
  const y = 3

  t.ok(isFunction(psi), 'is a function')

  const err = /TypeError: psi: First and second arguments must be functions/
  t.throws(fn(undefined, g, x, y), err, 'throws with first arg undefined')
  t.throws(fn(null, g, x, y), err, 'throws with first arg null')
  t.throws(fn(0, g, x, y), err, 'throws with first arg falsey number')
  t.throws(fn(1, g, x, y), err, 'throws with first arg truthy number')
  t.throws(fn('', g, x, y), err, 'throws with first arg falsey string')
  t.throws(fn('string', g, x, y), err, 'throws with first arg truthy string')
  t.throws(fn(false, g, x, y), err, 'throws with first arg false')
  t.throws(fn(true, g, x, y), err, 'throws with first arg true')
  t.throws(fn({}, g, x, y), err, 'throws with first arg an object')
  t.throws(fn([], g, x, y), err, 'throws with first arg an array')

  t.throws(fn(f, undefined, x, y), err, 'throws with second arg undefined')
  t.throws(fn(f, null, x, y), err, 'throws with second arg null')
  t.throws(fn(f, 0, x, y), err, 'throws with second arg falsey number')
  t.throws(fn(f, 1, x, y), err, 'throws with second arg truthy number')
  t.throws(fn(f, '', x, y), err, 'throws with second arg falsey string')
  t.throws(fn(f, 'bling', x, y), err, 'throws with second arg truthy string')
  t.throws(fn(f, false, x, y), err, 'throws with second arg false')
  t.throws(fn(f, true, x, y), err, 'throws with second arg true')
  t.throws(fn(f, {}, x, y), err, 'throws with second arg an object')
  t.throws(fn(f, [], x, y), err, 'throws with second arg an array')

  const result = fn(f, g, x, y)

  t.equal(result(), 42, 'returns expected result')

  t.end()
})
