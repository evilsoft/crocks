const test = require('tape')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const isFunction = require('../core/isFunction')

const compose2 = require('./compose2')

test('compose2', t => {
  const fn = bindFunc(compose2)
  const f = x => y => x * y
  const g = x => x - 1
  const h = x => x + 1
  const x = 22
  const y = 1

  t.ok(isFunction(compose2), 'is a function')

  const err = /^TypeError: compose2: First, second and third arguments must be functions/
  t.throws(fn(undefined, g, h, x, y), err, 'throws with first arg undefined')
  t.throws(fn(null, g, h, x, y), err, 'throws with first arg null')
  t.throws(fn(0, g, h, x, y), err, 'throws with first arg falsey number')
  t.throws(fn(1, g, h, x, y), err, 'throws with first arg truthy number')
  t.throws(fn('', g, h, x, y), err, 'throws with first arg falsey string')
  t.throws(fn('string', g, h, x, y), err, 'throws with first arg truthy string')
  t.throws(fn(false, g, h, x, y), err, 'throws with first arg false')
  t.throws(fn(true, g, h, x, y), err, 'throws with first arg true')
  t.throws(fn({}, g, h, x, y), err, 'throws with first arg an object')
  t.throws(fn([], g, h, x, y), err, 'throws with first arg an array')

  t.throws(fn(f, undefined, h, x, y), err, 'throws with second arg undefined')
  t.throws(fn(f, null, h, x, y), err, 'throws with second arg null')
  t.throws(fn(f, 0, h, x, y), err, 'throws with second arg falsey number')
  t.throws(fn(f, 1, h, x, y), err, 'throws with second arg truthy number')
  t.throws(fn(f, '', h, x, y), err, 'throws with second arg falsey string')
  t.throws(fn(f, 'bling', h, x, y), err, 'throws with second arg truthy string')
  t.throws(fn(f, false, h, x, y), err, 'throws with second arg false')
  t.throws(fn(f, true, h, x, y), err, 'throws with second arg true')
  t.throws(fn(f, {}, h, x, y), err, 'throws with second arg an object')
  t.throws(fn(f, [], h, x, y), err, 'throws with second arg an array')

  t.throws(fn(f, g, undefined, x, y), err, 'throws with third arg undefined')
  t.throws(fn(f, g, null, x, y), err, 'throws with third arg null')
  t.throws(fn(f, g, 0, x, y), err, 'throws with third arg falsey number')
  t.throws(fn(f, g, 1, x, y), err, 'throws with third arg truthy number')
  t.throws(fn(f, g, '', x, y), err, 'throws with third arg falsey string')
  t.throws(fn(f, g, 'string', x, y), err, 'throws with third arg truthy string')
  t.throws(fn(f, g, false, x, y), err, 'throws with third arg false')
  t.throws(fn(f, g, true, x, y), err, 'throws with third arg true')
  t.throws(fn(f, g, {}, x, y), err, 'throws with third arg an object')
  t.throws(fn(f, g, [], x, y), err, 'throws with third arg an array')

  const result = fn(f, g, h, x, y)

  t.equal(result(), 42, 'returns expected result')

  t.end()
})
