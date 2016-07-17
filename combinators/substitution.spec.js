const test    = require('tape')
const sinon   = require('sinon')
const helpers = require('../test/helpers')

const isFunction  = require('../internal/isFunction')
const bindFunc    = helpers.bindFunc

const curry    = require('../funcs/curry')
const identity = require('./identity')

const sub = require('./substitution')

test('substitution (S combinator)', t => {
  const s = bindFunc(sub)
  const x = 67
  const f = sinon.spy(curry((x, y) => x + y))
  const g = sinon.spy(identity)

  t.ok(isFunction(sub), 'is a function')

  t.throws(s(undefined, f, x), TypeError, 'throws with first arg undefined')
  t.throws(s(null, f, x), TypeError, 'throws with first arg null')
  t.throws(s(0, f, x), TypeError, 'throws with first arg falsey number')
  t.throws(s(1, f, x), TypeError, 'throws with first arg truthy number')
  t.throws(s('', f, x), TypeError, 'throws with first arg falsey string')
  t.throws(s('string', f, x), TypeError, 'throws with first arg truthy string')
  t.throws(s(false, f, x), TypeError, 'throws with first arg false')
  t.throws(s(true, f, x), TypeError, 'throws with first arg true')
  t.throws(s({}, f, x), TypeError, 'throws with first arg an object')
  t.throws(s([], f, x), TypeError, 'throws with first arg an array')

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

  const result = sub(f)(g)(x)
  console.log('salt', result);
  console.log('pepper', f.returnValues[0]);

  console.log('tickles', sub(x => y => x + y, x => x, 4));

  t.ok(f.calledWith(x), 'calls the first function passing the data and result of second function')
  t.ok(g.calledWith(x), 'calls the second function passing the data')
  // t.equals(f.returnValues[0], result, 'returns the result of the first function')

  t.end()
})
