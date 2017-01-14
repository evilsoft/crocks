const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc
const isFunction = require('../predicates/isFunction')

const identity = require('./identity')

const sub = require('./substitution')

test('substitution (S combinator)', t => {
  const s = bindFunc(sub)
  const x = 67
  const f = x => y => x + y
  const g = identity

  t.ok(isFunction(sub), 'is a function')

  t.throws(s(undefined, g, x), TypeError, 'throws with first arg undefined')
  t.throws(s(null, g, x), TypeError, 'throws with first arg null')
  t.throws(s(0, g, x), TypeError, 'throws with first arg falsey number')
  t.throws(s(1, g, x), TypeError, 'throws with first arg truthy number')
  t.throws(s('', g, x), TypeError, 'throws with first arg falsey string')
  t.throws(s('string', g, x), TypeError, 'throws with first arg truthy string')
  t.throws(s(false, g, x), TypeError, 'throws with first arg false')
  t.throws(s(true, g, x), TypeError, 'throws with first arg true')
  t.throws(s({}, g, x), TypeError, 'throws with first arg an object')
  t.throws(s([], g, x), TypeError, 'throws with first arg an array')

  t.throws(s(f, undefined, x), TypeError, 'throws with second arg undefined')
  t.throws(s(f, null, x), TypeError, 'throws with second arg null')
  t.throws(s(f, 0, x), TypeError, 'throws with second arg falsey number')
  t.throws(s(f, 1, x), TypeError, 'throws with second arg truthy number')
  t.throws(s(f, '', x), TypeError, 'throws with second arg falsey string')
  t.throws(s(f, 'bling', x), TypeError, 'throws with second arg truthy string')
  t.throws(s(f, false, x), TypeError, 'throws with second arg false')
  t.throws(s(f, true, x), TypeError, 'throws with second arg true')
  t.throws(s(f, {}, x), TypeError, 'throws with second arg an object')
  t.throws(s(f, [], x), TypeError, 'throws with second arg an array')

  const result = sub(f, g, 2)

  t.equal(result, 4, 'returns expected result')

  t.end()
})
