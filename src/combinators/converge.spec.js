const test = require('tape')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc
const isFunction = require('../core/isFunction')

const sub = require('./converge')

test('converge (Big Phi or S\' combinator)', t => {
  const s = bindFunc(sub)
  const x = 67
  const f = x => y => x + y
  const g = x => x - 1
  const h = x => x + 1

  t.ok(isFunction(sub), 'is a function')

  const err = /converge: Functions required for first three arguments/
  t.throws(s(undefined, g, h, x), err, 'throws with first arg undefined')
  t.throws(s(null, g, h, x), err, 'throws with first arg null')
  t.throws(s(0, g, h, x), err, 'throws with first arg falsey number')
  t.throws(s(1, g, h, x), err, 'throws with first arg truthy number')
  t.throws(s('', g, h, x), err, 'throws with first arg falsey string')
  t.throws(s('string', g, h, x), err, 'throws with first arg truthy string')
  t.throws(s(false, g, h, x), err, 'throws with first arg false')
  t.throws(s(true, g, h, x), err, 'throws with first arg true')
  t.throws(s({}, g, h, x), err, 'throws with first arg an object')
  t.throws(s([], g, h, x), err, 'throws with first arg an array')

  t.throws(s(f, undefined, h, x), err, 'throws with second arg undefined')
  t.throws(s(f, null, h, x), err, 'throws with second arg null')
  t.throws(s(f, 0, h, x), err, 'throws with second arg falsey number')
  t.throws(s(f, 1, h, x), err, 'throws with second arg truthy number')
  t.throws(s(f, '', h, x), err, 'throws with second arg falsey string')
  t.throws(s(f, 'bling', h, x), err, 'throws with second arg truthy string')
  t.throws(s(f, false, h, x), err, 'throws with second arg false')
  t.throws(s(f, true, h, x), err, 'throws with second arg true')
  t.throws(s(f, {}, h, x), err, 'throws with second arg an object')
  t.throws(s(f, [], h, x), err, 'throws with second arg an array')

  t.throws(s(f, g, undefined, x), err, 'throws with third arg undefined')
  t.throws(s(f, g, null, x), err, 'throws with third arg null')
  t.throws(s(f, g, 0, x), err, 'throws with third arg falsey number')
  t.throws(s(f, g, 1, x), err, 'throws with third arg truthy number')
  t.throws(s(f, g, '', x), err, 'throws with third arg falsey string')
  t.throws(s(f, g, 'string', x), err, 'throws with third arg truthy string')
  t.throws(s(f, g, false, x), err, 'throws with third arg false')
  t.throws(s(f, g, true, x), err, 'throws with third arg true')
  t.throws(s(f, g, {}, x), err, 'throws with third arg an object')
  t.throws(s(f, g, [], x), err, 'throws with third arg an array')

  const result = sub(f, g, h, x)

  t.equal(result, 134, 'returns expected result')

  t.end()
})
