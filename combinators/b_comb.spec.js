const test  = require('tape')
const sinon = require('sinon')

const helpers   = require('../test/helpers')
const bindFunc  = helpers.bindFunc
const id        = helpers.id

const b_comb = require('./b_comb')

test('b_comb (B combinator)', t => {
  const b = bindFunc(b_comb)

  t.equal(typeof b_comb, 'function', 'is a function')

  t.throws(b(0, id, 0), TypeError, 'throws when first arg is a falsey number')
  t.throws(b(1, id, 0), TypeError, 'throws when first arg is a truthy number')
  t.throws(b('', id, 0), TypeError, 'throws when first arg is a falsey string')
  t.throws(b('string', id, 0), TypeError, 'throws when first arg is a truthy string')
  t.throws(b(false, id, 0), TypeError, 'throws when first arg is false')
  t.throws(b(true, id, 0), TypeError, 'throws when first arg is true')
  t.throws(b([], id, 0), TypeError, 'throws when first arg is an array')
  t.throws(b({}, id, 0), TypeError, 'throws when first arg is an object')

  t.throws(b(id, 0, 0), TypeError, 'throws when second arg is a falsey number')
  t.throws(b(id, 1, 0), TypeError, 'throws when second arg is a truthy number')
  t.throws(b(id, '', 0), TypeError, 'throws when second arg is a falsey string')
  t.throws(b(id, 'string', 0), TypeError, 'throws when second arg is a truthy string')
  t.throws(b(id, false, 0), TypeError, 'throws when second arg is false')
  t.throws(b(id, true, 0), TypeError, 'throws when second arg is true')
  t.throws(b(id, [], 0), TypeError, 'throws when second arg is an array')
  t.throws(b(id, {}, 0), TypeError, 'throws when second arg is an object')

  const f = sinon.spy(id)
  const g = sinon.spy(id)
  const x = 74

  const result = b_comb(f)(g)(x)

  t.equal(f.calledAfter(g), true, 'calls second function before the first')
  t.equal(g.calledWith(x), true, 'third argument passed into second function')
  t.equal(f.calledWith(g.returnValues[0]), true, 'first function passed result of second function')
  t.equal(result, f.returnValues[0], 'return the result of the first function')

  t.end()
})
