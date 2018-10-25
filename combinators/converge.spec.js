const test = require('tape')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc
const isFunction = require('../predicates/isFunction')

const sub = require('./converge')

test('converge (Phoenix Combinator)', t => {
  const s = bindFunc(sub)
  const x = 67
  const f = x => y => x + y
  const g = x => x - 1
  const h = x => x + 1

  t.ok(isFunction(sub), 'is a function')

  t.throws(s(undefined, g, h, x), TypeError, 'throws with first arg undefined')
  t.throws(s(null, g, h, x), TypeError, 'throws with first arg null')
  t.throws(s(0, g, h, x), TypeError, 'throws with first arg falsey number')
  t.throws(s(1, g, h, x), TypeError, 'throws with first arg truthy number')
  t.throws(s('', g, h, x), TypeError, 'throws with first arg falsey string')
  t.throws(s('string', g, h, x), TypeError, 'throws with first arg truthy string')
  t.throws(s(false, g, h, x), TypeError, 'throws with first arg false')
  t.throws(s(true, g, h, x), TypeError, 'throws with first arg true')
  t.throws(s({}, g, h, x), TypeError, 'throws with first arg an object')
  t.throws(s([], g, h, x), TypeError, 'throws with first arg an array')

  t.throws(s(f, undefined, h, x), TypeError, 'throws with second arg undefined')
  t.throws(s(f, null, h, x), TypeError, 'throws with second arg null')
  t.throws(s(f, 0, h, x), TypeError, 'throws with second arg falsey number')
  t.throws(s(f, 1, h, x), TypeError, 'throws with second arg truthy number')
  t.throws(s(f, '', h, x), TypeError, 'throws with second arg falsey string')
  t.throws(s(f, 'bling', h, x), TypeError, 'throws with second arg truthy string')
  t.throws(s(f, false, h, x), TypeError, 'throws with second arg false')
  t.throws(s(f, true, h, x), TypeError, 'throws with second arg true')
  t.throws(s(f, {}, h, x), TypeError, 'throws with second arg an object')
  t.throws(s(f, [], h, x), TypeError, 'throws with second arg an array')

  t.throws(s(f, g, undefined, x), TypeError, 'throws with third arg undefined')
  t.throws(s(f, g, null, x), TypeError, 'throws with third arg null')
  t.throws(s(f, g, 0, x), TypeError, 'throws with third arg falsey number')
  t.throws(s(f, g, 1, x), TypeError, 'throws with third arg truthy number')
  t.throws(s(f, g, '', x), TypeError, 'throws with third arg falsey string')
  t.throws(s(f, g, 'string', x), TypeError, 'throws with third arg truthy string')
  t.throws(s(f, g, false, x), TypeError, 'throws with third arg false')
  t.throws(s(f, g, true, x), TypeError, 'throws with third arg true')
  t.throws(s(f, g, {}, x), TypeError, 'throws with third arg an object')
  t.throws(s(f, g, [], x), TypeError, 'throws with third arg an array')

  const result = sub(f, g, h, 2)

  t.equal(result, 4, 'returns expected result')

  t.end()
})
