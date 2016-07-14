const test  = require('tape')
const sinon = require('sinon')

const helpers   = require('../test/helpers')
const bindFunc  = helpers.bindFunc

const identity      = require('./identity')
const reverseApply  = require('./reverseApply')

test('reverseApply (T combinator)', t => {
  const tc = bindFunc(reverseApply)

  t.equal(typeof reverseApply, 'function', 'is a function')

  t.throws(tc(0, undefined), 'throws when second arg is undefined')
  t.throws(tc(0, null), 'throws when second arg is null')
  t.throws(tc(0, 0), 'throws when second arg is a falsey number')
  t.throws(tc(0, 1), 'throws when second arg is a truthy number')
  t.throws(tc(0, ''), 'throws when second arg is a falsey string')
  t.throws(tc(0, 'string'), 'throws when second arg is a truthy string')
  t.throws(tc(0, false), 'throws when second arg is false')
  t.throws(tc(0, true), 'thROWS WHEN second arg is true')
  t.throws(tc(0, []), 'throws when second arg is an array')
  t.throws(tc(0, {}), 'throws when second arg is an object')

  const f = sinon.spy(identity)
  const x = 23

  const result = reverseApply(x)(f)

  t.equal(f.calledWith(x), true, 'function called passing first arg')
  t.equal(result, x, 'returns the result of the passed function')


  t.end()
})
